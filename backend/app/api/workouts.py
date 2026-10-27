from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from datetime import date
from app.data.mock_data import WORKOUTS, STUDENTS, PROFILES

router = APIRouter(prefix="/workouts", tags=["Fichas de Treino & Natação"])

class ExerciseItem(BaseModel):
    series: str
    item: str
    pace: str

class WorkoutCreate(BaseModel):
    student_id: str
    instructor_id: str
    title: str
    modality: str
    notes: Optional[str] = None
    exercises: List[ExerciseItem]

@router.get("")
def list_workouts(student_id: Optional[str] = None):
    results = WORKOUTS
    if student_id:
        results = [w for w in results if w["student_id"] == student_id]
    return results

@router.post("", status_code=201)
def create_workout(data: WorkoutCreate):
    new_w = data.model_dump()
    new_w["id"] = f"w{len(WORKOUTS) + 1:03d}"
    new_w["created_at"] = str(date.today())
    
    # Preencher nomes
    student = next((s for s in STUDENTS if s["id"] == data.student_id), None)
    new_w["student_name"] = student["name"] if student else "Aluno"
    
    prof = next((p for p in PROFILES if p["id"] == data.instructor_id), None)
    new_w["instructor_name"] = prof["name"] if prof else "Professor"
    
    WORKOUTS.insert(0, new_w)
    return new_w
