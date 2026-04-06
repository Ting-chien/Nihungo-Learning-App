from datetime import datetime, timezone

from sqlalchemy import Boolean, DateTime, ForeignKey, Integer, String
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.core.database import Base


class QuizSession(Base):
    """One completed quiz attempt."""

    __tablename__ = "quiz_sessions"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    taken_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
    score: Mapped[int] = mapped_column(Integer, nullable=False)
    total: Mapped[int] = mapped_column(Integer, nullable=False)

    answers: Mapped[list["QuizAnswer"]] = relationship(
        "QuizAnswer", back_populates="session", cascade="all, delete-orphan"
    )


class QuizAnswer(Base):
    """One answer within a quiz session."""

    __tablename__ = "quiz_answers"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    session_id: Mapped[int] = mapped_column(
        Integer, ForeignKey("quiz_sessions.id", ondelete="CASCADE"), nullable=False
    )
    kana: Mapped[str] = mapped_column(String(4), nullable=False)
    romaji_expected: Mapped[str] = mapped_column(String(8), nullable=False)
    romaji_given: Mapped[str] = mapped_column(String(32), nullable=False)
    is_correct: Mapped[bool] = mapped_column(Boolean, nullable=False)
    timed_out: Mapped[bool] = mapped_column(Boolean, nullable=False, default=False)

    session: Mapped["QuizSession"] = relationship("QuizSession", back_populates="answers")
