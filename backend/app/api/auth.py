from fastapi import APIRouter, HTTPException
from app.data.mock_data import PROFILES

router = APIRouter(prefix="/auth", tags=["Autenticação & Perfis"])

@router.get("/profiles")
def list_profiles():
    """Retorna a lista de usuários mockados (2 Administradores e 5 Professores) para o seletor."""
    return PROFILES

@router.get("/profiles/{profile_id}")
def get_profile(profile_id: str):
    for p in PROFILES:
        if p["id"] == profile_id:
            return p
    raise HTTPException(status_code=404, detail="Perfil não encontrado")
