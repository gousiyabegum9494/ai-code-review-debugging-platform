from fastapi import APIRouter
from pydantic import BaseModel

from analyzers.security import analyze_security
from analyzers.bug import analyze_bugs
from analyzers.quality import analyze_quality
from analyzers.performance import analyze_performance

from services.llm_service import generate_ai_explanation
from services.semgrep_service import run_semgrep
from services.tree_sitter_service import parse_python_code


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

            # ---------------------------------
            # Tree-sitter Syntax Parsing
            # ---------------------------------
            syntax_result = parse_python_code(
                file.content
            )

            # ---------------------------------
            # Bug Analysis
            # ---------------------------------
            all_issues.extend(
                analyze_bugs(
                    file.content,
                    file.filename
                )
            )

            # ---------------------------------
            # Code Quality Analysis
            # ---------------------------------
            all_issues.extend(
                analyze_quality(
                    file.content,
                    file.filename
                )
            )

            # ---------------------------------
            # Security Analysis
            # ---------------------------------
            all_issues.extend(
                analyze_security(
                    file.content,
                    file.filename
                )
            )

            # ---------------------------------
            # Performance Analysis
            # ---------------------------------
            all_issues.extend(
                analyze_performance(
                    file.content,
                    file.filename
                )
            )

            # ---------------------------------
            # Semgrep Analysis
            # ---------------------------------
            all_issues.extend(
                run_semgrep(
                    file.content,
                    file.filename
                )
            )

            # ---------------------------------
            # Tree-sitter Syntax Information
            # ---------------------------------
            if not syntax_result.get("success"):

                all_issues.append({
                    "file": file.filename,
                    "line": 1,
                    "category": "Syntax",
                    "severity": "High",
                    "title": "Tree-sitter parsing failed",
                    "description": (
                        syntax_result.get(
                            "error",
                            "Unable to parse the source code."
                        )
                    ),
                    "recommendation": (
                        "Check the source code syntax."
                    ),
                    "confidence": 1.0
                })

            # ---------------------------------
            # AI Explanations
            # ---------------------------------
            for issue in all_issues:

                if issue.get("file") != file.filename:
                    continue

                ai_explanation = generate_ai_explanation(
                    file.content,
                    issue
                )

                if ai_explanation:
                    issue["ai_explanation"] = ai_explanation
                    issue["explanation_source"] = "LLM"

                else:
                    issue["ai_explanation"] = None
                    issue["explanation_source"] = (
                        "Rule-based fallback"
                    )

    return {
        "message": "Project reviewed successfully",
        "project_id": request.project_id,
        "file_count": len(request.files),
        "issue_count": len(all_issues),
        "issues": all_issues
    }