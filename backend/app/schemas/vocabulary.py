from datetime import datetime

from pydantic import BaseModel


# --- Input schemas ---

class VocabularyCreate(BaseModel):
    japanese: str
    kana: str
    accent: int | None = None
    chinese: str


class VocabularyUpdate(BaseModel):
    japanese: str
    kana: str
    accent: int | None = None
    chinese: str


# --- Output schemas ---

class VocabularyResponse(BaseModel):
    id: int
    japanese: str
    kana: str
    accent: int | None
    chinese: str
    created_at: datetime

    model_config = {"from_attributes": True}
