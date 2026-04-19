from fastapi import APIRouter

from app.api.v1.endpoints.quiz_history import router as quiz_history_router
from app.api.v1.endpoints.vocabulary import router as vocabulary_router

router = APIRouter()
router.include_router(quiz_history_router, prefix="/quiz-history", tags=["quiz-history"])
router.include_router(vocabulary_router, prefix="/vocabulary", tags=["vocabulary"])
