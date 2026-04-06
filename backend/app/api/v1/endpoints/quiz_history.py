from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.quiz_history_repository import QuizHistoryRepository
from app.schemas.quiz_history import (
    QuizSessionCreate,
    QuizSessionDetailResponse,
    QuizSessionSummaryResponse,
)
from app.services.quiz_history_service import QuizHistoryService

router = APIRouter()


def _get_service(db: Session = Depends(get_db)) -> QuizHistoryService:
    """Dependency: build the service with its repository."""
    return QuizHistoryService(QuizHistoryRepository(db))


@router.post("", status_code=201)
def create_quiz_session(
    body: QuizSessionCreate,
    service: QuizHistoryService = Depends(_get_service),
) -> dict:
    """Save a completed quiz session and return the created record."""
    session = service.save_session(body)
    return {
        "success": True,
        "message": "Quiz session saved",
        "data": QuizSessionSummaryResponse.model_validate(session),
    }


@router.get("")
def list_quiz_sessions(
    service: QuizHistoryService = Depends(_get_service),
) -> dict:
    """Return all quiz sessions ordered by most-recent first."""
    sessions = service.list_sessions()
    return {
        "success": True,
        "message": "OK",
        "data": [QuizSessionSummaryResponse.model_validate(s) for s in sessions],
    }


@router.get("/{session_id}")
def get_quiz_session(
    session_id: int,
    service: QuizHistoryService = Depends(_get_service),
) -> dict:
    """Return a single quiz session with per-answer detail."""
    session = service.get_session(session_id)
    return {
        "success": True,
        "message": "OK",
        "data": QuizSessionDetailResponse.model_validate(session),
    }
