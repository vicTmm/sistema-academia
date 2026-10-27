from fastapi import APIRouter, Header
from typing import Optional
from app.data.mock_data import STUDENTS, CLASSES, FINANCIAL_TRANSACTIONS, CHECK_INS

router = APIRouter(prefix="/dashboard", tags=["Dashboard"])

@router.get("/metrics")
def get_dashboard_metrics(x_user_role: Optional[str] = Header(default="admin")):
    """Retorna métricas consolidadas do dashboard. Finanças só são visíveis se a role for 'admin'."""
    total_students = len(STUDENTS)
    active_students = len([s for s in STUDENTS if s["status"] == "active"])
    overdue_students = len([s for s in STUDENTS if s["status"] == "overdue"])
    
    total_capacity = sum(c["max_capacity"] for c in CLASSES)
    total_enrolled = sum(c["enrolled_count"] for c in CLASSES)
    pool_occupancy_rate = round((total_enrolled / total_capacity * 100), 1) if total_capacity > 0 else 0
    
    metrics = {
        "total_students": total_students,
        "active_students": active_students,
        "overdue_students": overdue_students,
        "classes_count": len(CLASSES),
        "checkins_today": len(CHECK_INS),
        "occupancy_rate": pool_occupancy_rate,
        "is_admin": x_user_role == "admin"
    }

    # Restrição aos 2 Administradores
    if x_user_role == "admin":
        income = sum(t["amount"] for t in FINANCIAL_TRANSACTIONS if t["type"] == "income" and t["status"] == "paid")
        pending_income = sum(t["amount"] for t in FINANCIAL_TRANSACTIONS if t["type"] == "income" and t["status"] != "paid")
        expenses = sum(t["amount"] for t in FINANCIAL_TRANSACTIONS if t["type"] == "expense")
        net_balance = income - expenses

        metrics["financial"] = {
            "monthly_income": round(income, 2),
            "pending_income": round(pending_income, 2),
            "monthly_expenses": round(expenses, 2),
            "net_balance": round(net_balance, 2)
        }
    else:
        metrics["financial"] = None

    return metrics
