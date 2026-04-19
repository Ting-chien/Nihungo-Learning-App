from app.core.exceptions import VocabularyNotFoundError
from app.models.vocabulary import Vocabulary
from app.repositories.vocabulary_repository import VocabularyRepository
from app.schemas.vocabulary import VocabularyCreate, VocabularyUpdate


class VocabularyService:
    """Business logic for vocabulary management."""

    def __init__(self, repo: VocabularyRepository) -> None:
        self._repo = repo

    def add_entry(self, data: VocabularyCreate) -> Vocabulary:
        """Validate and persist a new vocabulary entry.

        Args:
            data: Validated input schema from the request body.

        Returns:
            The persisted Vocabulary ORM instance.
        """
        return self._repo.create(
            japanese=data.japanese,
            kana=data.kana,
            accent=data.accent,
            chinese=data.chinese,
        )

    def list_entries(self) -> list[Vocabulary]:
        """Return all vocabulary entries ordered by creation time (newest first)."""
        return self._repo.list_all()

    def update_entry(self, entry_id: int, data: VocabularyUpdate) -> Vocabulary:
        """Update an existing vocabulary entry.

        Raises:
            VocabularyNotFoundError: If no entry with the given id exists.
        """
        entry = self._repo.get(entry_id)
        if entry is None:
            raise VocabularyNotFoundError(f"Vocabulary entry {entry_id} not found")
        return self._repo.update(
            entry,
            japanese=data.japanese,
            kana=data.kana,
            accent=data.accent,
            chinese=data.chinese,
        )

    def delete_entry(self, entry_id: int) -> None:
        """Delete a vocabulary entry by id.

        Raises:
            VocabularyNotFoundError: If no entry with the given id exists.
        """
        entry = self._repo.get(entry_id)
        if entry is None:
            raise VocabularyNotFoundError(f"Vocabulary entry {entry_id} not found")
        self._repo.delete(entry)
