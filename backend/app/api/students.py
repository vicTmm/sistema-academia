from fastapi import APIRouter, HTTPException, Query
from pydantic import BaseModel
from typing import Optional, List
import uuid
from datetime import date
from app.data.mock_data import STUDENTS

router = APIRouter(prefix="/students", tags=["Alunos"])

class StudentCreate(BaseModel):
    name: str
    email: str
    phone: str
    cpf: str
    birth_date: Optional[str] = None
    plan: str
    modalities: List[str]
    monthly_fee: float
    due_day: int = 10
    emergency_contact: Optional[str] = None
    medical_notes: Optional[str] = None
    status: str = "active"

@router.get("")
def list_students(
    search: Optional[str] = None,
    status: Optional[str] = None,
    modality: Optional[str] = None
):
    results = STUDENTS
    if search:
        s_lower = search.lower()
        results = [s for s in results if s_lower in s["name"].lower() or s_lower in s["cpf"] or s_lower in s["email"].lower()]
    if status and status != "all":
        results = [s for s in results if s["status"] == status]
    if modality and modality != "all":
        results = [s for s in results if any(modality.lower() in m.lower() for m in s["modalities"])]
    return results

@router.get("/{student_id}")
def get_student(student_id: str):
    for s in STUDENTS:
        if s["id"] == student_id:
            return s
    raise HTTPException(status_code=404, detail="Aluno não encontrado")

@router.post("", status_code=201)
def create_student(data: StudentCreate):
    new_student = data.model_dump()
    new_student["id"] = f"s{len(STUDENTS) + 1:03d}"
    new_student["enrolled_at"] = str(date.today())
    STUDENTS.insert(0, new_student)
    return new_student

@router.put("/{student_id}")
def update_student(student_id: str, data: StudentCreate):
    for i, s in enumerate(STUDENTS):
        if s["id"] == student_id:
            updated = data.model_dump()
            updated["id"] = student_id
            updated["enrolled_at"] = s.get("enrolled_at", str(date.today()))
            STUDENTS[i] = updated
            return updated
    raise HTTPException(status_code=404, detail="Aluno não encontrado")

@router.delete("/{student_id}")
def delete_student(student_id: str):
    for i, s in enumerate(STUDENTS):
        if s["id"] == student_id:
            deleted = STUDENTS.pop(i)
            return {"message": f"Aluno {deleted['name']} removido com sucesso"}
    raise HTTPException(status_code=404, detail="Aluno não encontrado")
