from sqlalchemy.orm import Session

from app.models.quiz_history import QuizAnswer, QuizSession


class QuizHistoryRepository:
    """All database operations for quiz sessions and answers."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create_session(self, score: int, total: int, answers: list[dict]) -> QuizSession:
        """Persist a new quiz session together with all its answers.

        Args:
            score: Number of correct answers.
            total: Total number of questions.
            answers: List of answer dicts matching QuizAnswer column names.

        Returns:
            The newly created and refreshed QuizSession ORM instance.
        """
        session = QuizSession(score=score, total=total)
        self._db.add(session)
        self._db.flush()  # get session.id before inserting answers

        for ans in answers:
            self._db.add(QuizAnswer(session_id=session.id, **ans))

        self._db.commit()
        self._db.refresh(session)
        return session

    def list_sessions(self) -> list[QuizSession]:
        """Return all sessions ordered by most-recent first."""
        return (
            self._db.query(QuizSession)
            .order_by(QuizSession.taken_at.desc())
            .all()
        )

    def get_session(self, session_id: int) -> QuizSession | None:
        """Return a session with its answers, or None if not found."""
        return self._db.query(QuizSession).filter(QuizSession.id == session_id).first()
