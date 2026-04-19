from datetime import datetime, timezone

from sqlalchemy import DateTime, Integer, SmallInteger, String
from sqlalchemy.orm import Mapped, mapped_column

from app.core.database import Base


class Vocabulary(Base):
    """A single vocabulary entry recorded by the learner."""

    __tablename__ = "vocabulary"

    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    japanese: Mapped[str] = mapped_column(String(64), nullable=False)
    kana: Mapped[str] = mapped_column(String(64), nullable=False)
    # Pitch accent number (0 = flat, 1 = atamadaka, 2+ = nakadaka/odaka)
    accent: Mapped[int | None] = mapped_column(SmallInteger, nullable=True)
    chinese: Mapped[str] = mapped_column(String(128), nullable=False)
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )
