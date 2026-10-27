from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from typing import Optional
from datetime import datetime
from app.data.mock_data import CHECK_INS, STUDENTS

router = APIRouter(prefix="/checkins", tags=["Check-in e Catraca"])

class CheckInRequest(BaseModel):
    cpf_or_id: str

@router.get("")
def list_checkins():
    return sorted(CHECK_INS, key=lambda x: x["checked_in_at"], reverse=True)

@router.post("")
def do_checkin(req: CheckInRequest):
    search_term = req.cpf_or_id.strip()
    student = next(
        (s for s in STUDENTS if s["id"] == search_term or s["cpf"] == search_term or s["cpf"].replace(".", "").replace("-", "") == search_term.replace(".", "").replace("-", "")),
        None
    )
    
    if not student:
        raise HTTPException(status_code=404, detail="Aluno não encontrado para o CPF/ID informado.")
    
    if student["status"] == "suspended":
        raise HTTPException(status_code=403, detail="Acesso bloqueado: Matrícula com status Trancada.")

    is_overdue = student["status"] == "overdue"
    
    entry = {
        "id": f"chk{len(CHECK_INS) + 1:03d}",
        "student_id": student["id"],
        "student_name": student["name"],
        "checked_in_at": datetime.now().isoformat(),
        "status": "warning" if is_overdue else "authorized",
        "modality": ", ".join(student.get("modalities", []))
    }
    CHECK_INS.insert(0, entry)

    return {
        "authorized": True,
        "student": student,
        "entry": entry,
        "message": "Entrada Liberada! (Aviso: Mensalidade em aberto)" if is_overdue else "Acesso Liberado! Bem-vindo(a) à Acqua Planet!",
        "has_warning": is_overdue
    }
