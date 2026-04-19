from sqlalchemy.orm import Session

from app.models.vocabulary import Vocabulary


class VocabularyRepository:
    """All database operations for vocabulary entries."""

    def __init__(self, db: Session) -> None:
        self._db = db

    def create(self, japanese: str, kana: str, accent: int | None, chinese: str) -> Vocabulary:
        """Persist a new vocabulary entry and return it.

        Args:
            japanese: The word in kanji / Japanese script.
            kana: Hiragana or katakana reading.
            accent: Pitch accent number (None if unknown).
            chinese: Chinese translation.

        Returns:
            The newly created Vocabulary ORM instance.
        """
        entry = Vocabulary(japanese=japanese, kana=kana, accent=accent, chinese=chinese)
        self._db.add(entry)
        self._db.commit()
        self._db.refresh(entry)
        return entry

    def list_all(self) -> list[Vocabulary]:
        """Return all vocabulary entries ordered by creation time (newest first)."""
        return (
            self._db.query(Vocabulary)
            .order_by(Vocabulary.created_at.desc())
            .all()
        )

    def get(self, entry_id: int) -> Vocabulary | None:
        """Return a single vocabulary entry, or None if not found."""
        return self._db.query(Vocabulary).filter(Vocabulary.id == entry_id).first()

    def update(
        self, entry: Vocabulary, japanese: str, kana: str, accent: int | None, chinese: str
    ) -> Vocabulary:
        """Update fields of an existing vocabulary entry and return it.

        Args:
            entry: The ORM instance to update.
            japanese: New Japanese text.
            kana: New kana reading.
            accent: New pitch accent number, or None.
            chinese: New Chinese translation.

        Returns:
            The updated and refreshed Vocabulary ORM instance.
        """
        entry.japanese = japanese
        entry.kana = kana
        entry.accent = accent
        entry.chinese = chinese
        self._db.commit()
        self._db.refresh(entry)
        return entry

    def delete(self, entry: Vocabulary) -> None:
        """Delete a vocabulary entry."""
        self._db.delete(entry)
        self._db.commit()
