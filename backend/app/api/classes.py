from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from app.data.mock_data import CLASSES, STUDENTS

router = APIRouter(prefix="/classes", tags=["Turmas & Horários"])

class AttendanceMark(BaseModel):
    student_id: str
    present: bool

@router.get("")
def list_classes(modality: Optional[str] = None):
    results = CLASSES
    if modality and modality != "all":
        results = [c for c in results if modality.lower() in c["modality"].lower()]
    return results

@router.get("/{class_id}")
def get_class(class_id: str):
    for c in CLASSES:
        if c["id"] == class_id:
            # Enriquecer com lista de alunos
            enrolled_students = [s for s in STUDENTS if s["id"] in c.get("students_enrolled", [])]
            return {**c, "students_details": enrolled_students}
    raise HTTPException(status_code=404, detail="Turma não encontrada")

@router.post("/{class_id}/enroll")
def enroll_student(class_id: str, student_id: str):
    for c in CLASSES:
        if c["id"] == class_id:
            if student_id in c["students_enrolled"]:
                return {"message": "Aluno já matriculado nesta turma"}
            if c["enrolled_count"] >= c["max_capacity"]:
                raise HTTPException(status_code=400, detail="Turma com capacidade máxima atingida")
            c["students_enrolled"].append(student_id)
            c["enrolled_count"] = len(c["students_enrolled"])
            return {"message": "Matrícula na turma efetuada com sucesso", "class": c}
    raise HTTPException(status_code=404, detail="Turma não encontrada")
