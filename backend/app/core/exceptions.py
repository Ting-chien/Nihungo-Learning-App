class AppException(Exception):
    """Base class for all application-level exceptions."""


class QuizSessionNotFoundError(AppException):
    """Raised when a requested quiz session does not exist."""


class VocabularyNotFoundError(AppException):
    """Raised when a requested vocabulary entry does not exist."""
