from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api import auth, dashboard, students, financial, classes, workouts, checkin

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="API de Gestão da Academia Acqua Planet - Piscinas, Modalidades, Alunos e Finanças"
)

# Configuração de CORS para permitir acesso do React local e na Vercel
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Aberto para desenvolvimento ágil e preview da Vercel
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Registro das rotas
app.include_router(auth.router, prefix="/api")
app.include_router(dashboard.router, prefix="/api")
app.include_router(students.router, prefix="/api")
app.include_router(financial.router, prefix="/api")
app.include_router(classes.router, prefix="/api")
app.include_router(workouts.router, prefix="/api")
app.include_router(checkin.router, prefix="/api")

@app.get("/")
def root():
    return {
        "system": "Sistema Academia Acqua Planet",
        "status": "online",
        "version": settings.VERSION,
        "docs_url": "/docs"
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host=settings.HOST, port=settings.PORT, reload=True)
