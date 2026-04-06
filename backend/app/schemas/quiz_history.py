from datetime import datetime

from pydantic import BaseModel, computed_field


# --- Input schemas ---

class QuizAnswerCreate(BaseModel):
    kana: str
    romaji_expected: str
    romaji_given: str
    is_correct: bool
    timed_out: bool


class QuizSessionCreate(BaseModel):
    score: int
    total: int
    answers: list[QuizAnswerCreate]


# --- Output schemas ---

class QuizAnswerResponse(BaseModel):
    id: int
    kana: str
    romaji_expected: str
    romaji_given: str
    is_correct: bool
    timed_out: bool

    model_config = {"from_attributes": True}


class QuizSessionSummaryResponse(BaseModel):
    """Lightweight summary shown in the history list (left column)."""

    id: int
    taken_at: datetime
    score: int
    total: int

    @computed_field
    @property
    def precision(self) -> float:
        """Accuracy as a value between 0 and 1."""
        return self.score / self.total if self.total > 0 else 0.0

    model_config = {"from_attributes": True}


class QuizSessionDetailResponse(QuizSessionSummaryResponse):
    """Full session data including per-answer breakdown (right column)."""

    answers: list[QuizAnswerResponse]
