from fastapi import APIRouter, HTTPException, Header
from pydantic import BaseModel
from typing import Optional, List
from datetime import datetime
from app.data.mock_data import FINANCIAL_TRANSACTIONS

router = APIRouter(prefix="/financial", tags=["Financeiro (Acesso Restrito)"])

def verify_admin_access(role: Optional[str]):
    if role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Acesso negado: O módulo financeiro é restrito exclusivamente aos administradores."
        )

class TransactionCreate(BaseModel):
    description: str
    type: str # income ou expense
    category: str
    amount: float
    status: str = "paid"
    due_date: str
    student_id: Optional[str] = None

@router.get("/summary")
def get_financial_summary(x_user_role: Optional[str] = Header(default="admin")):
    verify_admin_access(x_user_role)
    
    incomes = [t for t in FINANCIAL_TRANSACTIONS if t["type"] == "income"]
    expenses = [t for t in FINANCIAL_TRANSACTIONS if t["type"] == "expense"]
    
    total_received = sum(t["amount"] for t in incomes if t["status"] == "paid")
    total_overdue = sum(t["amount"] for t in incomes if t["status"] == "overdue")
    total_pending = sum(t["amount"] for t in incomes if t["status"] == "pending")
    total_expenses = sum(t["amount"] for t in expenses)
    balance = total_received - total_expenses
    
    # Categorias de despesas da academia aquática
    categories = {}
    for e in expenses:
        cat = e["category"]
        categories[cat] = categories.get(cat, 0) + e["amount"]

    return {
        "total_received": round(total_received, 2),
        "total_overdue": round(total_overdue, 2),
        "total_pending": round(total_pending, 2),
        "total_expenses": round(total_expenses, 2),
        "balance": round(balance, 2),
        "expense_breakdown": [{"category": k, "amount": round(v, 2)} for k, v in categories.items()]
    }

@router.get("/transactions")
def list_transactions(
    type: Optional[str] = None,
    status: Optional[str] = None,
    x_user_role: Optional[str] = Header(default="admin")
):
    verify_admin_access(x_user_role)
    results = FINANCIAL_TRANSACTIONS
    if type and type != "all":
        results = [t for t in results if t["type"] == type]
    if status and status != "all":
        results = [t for t in results if t["status"] == status]
    return results

@router.post("/transactions", status_code=201)
def create_transaction(data: TransactionCreate, x_user_role: Optional[str] = Header(default="admin")):
    verify_admin_access(x_user_role)
    new_t = data.model_dump()
    new_t["id"] = f"tx{len(FINANCIAL_TRANSACTIONS) + 1:03d}"
    if new_t["status"] == "paid":
        new_t["paid_at"] = datetime.now().isoformat()
    else:
        new_t["paid_at"] = None
    FINANCIAL_TRANSACTIONS.insert(0, new_t)
    return new_t

@router.put("/transactions/{tx_id}/pay")
def mark_transaction_paid(tx_id: str, x_user_role: Optional[str] = Header(default="admin")):
    verify_admin_access(x_user_role)
    for t in FINANCIAL_TRANSACTIONS:
        if t["id"] == tx_id:
            t["status"] = "paid"
            t["paid_at"] = datetime.now().isoformat()
            return {"message": "Transação liquidada com sucesso", "transaction": t}
    raise HTTPException(status_code=404, detail="Transação não encontrada")
