from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.core.database import get_db
from app.repositories.vocabulary_repository import VocabularyRepository
from app.schemas.vocabulary import VocabularyCreate, VocabularyResponse, VocabularyUpdate
from app.services.vocabulary_service import VocabularyService

router = APIRouter()


def _get_service(db: Session = Depends(get_db)) -> VocabularyService:
    """Dependency: build the service with its repository."""
    return VocabularyService(VocabularyRepository(db))


@router.post("", status_code=201)
def create_vocabulary(
    body: VocabularyCreate,
    service: VocabularyService = Depends(_get_service),
) -> dict:
    """Add a new vocabulary entry and return the created record."""
    entry = service.add_entry(body)
    return {
        "success": True,
        "message": "Vocabulary entry created",
        "data": VocabularyResponse.model_validate(entry),
    }


@router.get("")
def list_vocabulary(
    service: VocabularyService = Depends(_get_service),
) -> dict:
    """Return all vocabulary entries ordered by most-recent first."""
    entries = service.list_entries()
    return {
        "success": True,
        "message": "OK",
        "data": [VocabularyResponse.model_validate(e) for e in entries],
    }


@router.put("/{entry_id}")
def update_vocabulary(
    entry_id: int,
    body: VocabularyUpdate,
    service: VocabularyService = Depends(_get_service),
) -> dict:
    """Update an existing vocabulary entry."""
    entry = service.update_entry(entry_id, body)
    return {
        "success": True,
        "message": "Vocabulary entry updated",
        "data": VocabularyResponse.model_validate(entry),
    }


@router.delete("/{entry_id}", status_code=200)
def delete_vocabulary(
    entry_id: int,
    service: VocabularyService = Depends(_get_service),
) -> dict:
    """Delete a vocabulary entry by id."""
    service.delete_entry(entry_id)
    return {"success": True, "message": "Vocabulary entry deleted", "data": None}
