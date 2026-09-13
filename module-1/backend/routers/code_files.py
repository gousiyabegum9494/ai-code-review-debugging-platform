
from fastapi import APIRouter, Depends, File, UploadFile, HTTPException
from sqlalchemy.orm import Session

from database.db import get_db
from models.code_file import CodeFile


router = APIRouter(
    prefix="/code",
    tags=["Code Input"]
)


def detect_language(filename: str) -> str:
    filename = filename.lower().strip()

    if "." in filename:
        extension = filename.rsplit(".", 1)[-1]
    else:
        extension = ""

    languages = {
        "py": "Python",
        "java": "Java",
        "js": "JavaScript",
        "jsx": "JavaScript",
        "ts": "TypeScript",
        "tsx": "TypeScript",
        "c": "C",
        "h": "C",
        "cpp": "C++",
        "cc": "C++",
        "cxx": "C++",
        "hpp": "C++",
        "cs": "C#",
        "go": "Go",
        "rs": "Rust",
        "php": "PHP",
        "rb": "Ruby",
        "kt": "Kotlin",
        "swift": "Swift",
        "html": "HTML",
        "htm": "HTML",
        "css": "CSS",
        "sql": "SQL",
        "sh": "Shell",
        "bash": "Shell",
        "dart": "Dart"
    }

    return languages.get(extension, "Unknown")


@router.post("/upload")
async def upload_code(
    project_id: int,
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):

    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="Filename is required"
        )

    content = await file.read()

    try:
        code_content = content.decode("utf-8")
    except UnicodeDecodeError:
        raise HTTPException(
            status_code=400,
            detail="Only UTF-8 text source-code files are supported"
        )

    language = detect_language(file.filename)

    new_code = CodeFile(
        project_id=project_id,
        filename=file.filename,
        language=language,
        content=code_content
    )

    db.add(new_code)
    db.commit()
    db.refresh(new_code)

    return {
        "message": "Code uploaded successfully",
        "file_id": new_code.id,
        "project_id": project_id,
        "filename": file.filename,
        "language": language
    }


@router.get("/{project_id}")
def get_project_code(
    project_id: int,
    db: Session = Depends(get_db)
):

    return db.query(CodeFile).filter(
        CodeFile.project_id == project_id
    ).all()
