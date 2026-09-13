from pydantic import BaseModel


class ProjectCreate(BaseModel):
    name: str
    description: str | None = None
    language: str | None = None


class ProjectResponse(BaseModel):
    id: int
    name: str
    description: str | None
    language: str | None

    class Config:
        from_attributes = True