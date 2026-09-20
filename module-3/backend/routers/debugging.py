from fastapi import APIRouter, HTTPException

from schemas.debugging import (
    DebugRequest,
    DebugResponse,
    PracticeCheckRequest,
    PracticeCheckResponse,
)
from services.debug_service import analyze, check_practice


router = APIRouter(prefix="/debug", tags=["AI Debugging"])


@router.post("/analyze", response_model=DebugResponse)
def analyze_code(request: DebugRequest):
    return analyze(request)


@router.post("/practice/check", response_model=PracticeCheckResponse)
def evaluate_practice(request: PracticeCheckRequest):
    try:
        return check_practice(request.question_id, request.answer)
    except ValueError as error:
        raise HTTPException(status_code=404, detail=str(error)) from error
