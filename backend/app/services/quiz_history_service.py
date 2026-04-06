from app.core.exceptions import QuizSessionNotFoundError
from app.models.quiz_history import QuizSession
from app.repositories.quiz_history_repository import QuizHistoryRepository
from app.schemas.quiz_history import QuizSessionCreate


class QuizHistoryService:
    """Business logic for quiz history management."""

    def __init__(self, repo: QuizHistoryRepository) -> None:
        self._repo = repo

    def save_session(self, data: QuizSessionCreate) -> QuizSession:
        """Validate and persist a completed quiz session.

        Args:
            data: Validated input schema from the request body.

        Returns:
            The persisted QuizSession ORM instance.
        """
        answers = [ans.model_dump() for ans in data.answers]
        return self._repo.create_session(
            score=data.score,
            total=data.total,
            answers=answers,
        )

    def list_sessions(self) -> list[QuizSession]:
        """Return all quiz sessions ordered by most-recent first."""
        return self._repo.list_sessions()

    def get_session(self, session_id: int) -> QuizSession:
        """Return a single session with its answers.

        Raises:
            QuizSessionNotFoundError: If no session with the given id exists.
        """
        session = self._repo.get_session(session_id)
        if session is None:
            raise QuizSessionNotFoundError(f"Quiz session {session_id} not found")
        return session
