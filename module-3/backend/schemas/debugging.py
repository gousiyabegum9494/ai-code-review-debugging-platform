from pydantic import BaseModel, Field


class DebugRequest(BaseModel):
    code: str = Field(min_length=1)
    language: str = Field(default="Python", min_length=1)
    error_message: str | None = None
    error_line: int | None = Field(default=None, ge=1)
    include_practice: bool = False
    experience_level: str = Field(default="beginner", min_length=1)


class PracticeQuestion(BaseModel):
    question_id: str
    concept: str
    prompt: str
    starter_code: str
    expected_answer: str
    hint: str


class DebugResponse(BaseModel):
    error_type: str
    error_title: str
    severity: str
    location: int | None
    simple_explanation: str
    technical_explanation: str
    root_cause: str
    suggested_fix: str
    corrected_code: str | None
    fix_explanation: list[str]
    prevention_tips: list[str]
    learning_summary: str
    practice: PracticeQuestion | None = None
    verification_status: str = "pending"


class PracticeCheckRequest(BaseModel):
    question_id: str = Field(min_length=1)
    answer: str = Field(min_length=1)


class PracticeCheckResponse(BaseModel):
    question_id: str
    correct: bool
    feedback: str
    expected_answer: str
