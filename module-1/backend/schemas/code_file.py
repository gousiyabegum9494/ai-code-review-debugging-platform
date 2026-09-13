from pydantic import BaseModel


class CodeFileCreate(BaseModel):
    project_id: int
    filename: str
    language: str | None = None
    content: str


class CodeFileResponse(BaseModel):
    id: int
    project_id: int
    filename: str
    language: str | None
    content: str

    class Config:
        from_attributes = True