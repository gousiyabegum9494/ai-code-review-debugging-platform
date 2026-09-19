from fastapi import APIRouter
from pydantic import BaseModel

from analyzers.security import analyze_security
from analyzers.bug import analyze_bugs
from analyzers.quality import analyze_quality
from analyzers.performance import analyze_performance


router = APIRouter(
    prefix="/review",
    tags=["AI Code Review"]
)


class CodeFile(BaseModel):
    filename: str
    language: str
    content: str


class ReviewRequest(BaseModel):
    project_id: int
    files: list[CodeFile]


@router.post("/")
def review_code(request: ReviewRequest):
    all_issues = []

    for file in request.files:

        # Currently run Python analyzers
        if file.language.lower() == "python":

            all_issues.extend(
                analyze_bugs(
                    file.content,
                    file.filename
                )
            )

            all_issues.extend(
                analyze_quality(
                    file.content,
                    file.filename
                )
            )

            all_issues.extend(
                analyze_security(
                    file.content,
                    file.filename
                )
            )

            all_issues.extend(
                analyze_performance(
                    file.content,
                    file.filename
                )
            )

    return {
        "message": "Project reviewed successfully",
        "project_id": request.project_id,
        "file_count": len(request.files),
        "issue_count": len(all_issues),
        "issues": all_issues
    }