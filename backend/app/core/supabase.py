import logging
from app.core.config import settings

logger = logging.getLogger("acquaplanet.supabase")

supabase_client = None

if settings.SUPABASE_URL and settings.SUPABASE_KEY:
    try:
        from supabase import create_client, Client
        supabase_client: Client = create_client(settings.SUPABASE_URL, settings.SUPABASE_KEY)
        logger.info("Supabase client conectado com sucesso!")
    except Exception as e:
        logger.warning(f"Erro ao conectar ao Supabase: {e}. Usando dados mockados.")
        supabase_client = None
else:
    logger.info("Credenciais do Supabase não configuradas no .env. Operando com dados mockados em memória para MVP.")

def get_supabase():
    return supabase_client
