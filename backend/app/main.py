from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse

from app.api.v1 import router as v1_router
from app.core.exceptions import AppException

app = FastAPI(title="Nihongo Learning App API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.exception_handler(AppException)
async def app_exception_handler(request: Request, exc: AppException) -> JSONResponse:
    """Convert domain exceptions to HTTP 404/400 responses."""
    from app.core.exceptions import QuizSessionNotFoundError, VocabularyNotFoundError

    status_code = 404 if isinstance(exc, (QuizSessionNotFoundError, VocabularyNotFoundError)) else 400
    return JSONResponse(
        status_code=status_code,
        content={"success": False, "message": str(exc), "data": None},
    )


app.include_router(v1_router, prefix="/api/v1")
