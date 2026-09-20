import re
import subprocess
import sys

from schemas.debugging import (
    DebugRequest,
    DebugResponse,
    PracticeCheckResponse,
    PracticeQuestion,
)


ERROR_GUIDES = {
    "NameError": {
        "title": "A name is used before it is defined",
        "severity": "high",
        "simple": "Python cannot find the variable or function name used in the code.",
        "technical": "Name resolution failed because the referenced identifier is not available in the current scope.",
        "cause": "The name may be misspelled, declared later, or outside the current scope.",
        "fix": "Define the name before using it and check that its spelling matches everywhere.",
        "prevention": [
            "Initialize variables before using them.",
            "Check spelling and capitalization of names.",
            "Keep related code in the correct scope.",
        ],
        "summary": "You learned that NameError means Python cannot find a referenced name.",
    },
    "IndexError": {
        "title": "A sequence index is outside its valid range",
        "severity": "high",
        "simple": "The code tried to access a list or sequence position that does not exist.",
        "technical": "The requested index is less than the sequence minimum or greater than its last valid index.",
        "cause": "Sequence indexes start at zero, so the last valid index is length minus one.",
        "fix": "Check the sequence length and use an index between zero and length minus one.",
        "prevention": [
            "Remember that Python uses zero-based indexing.",
            "Check len(sequence) before accessing a calculated index.",
            "Use a loop over the sequence when possible.",
        ],
        "summary": "You learned that IndexError occurs when a sequence position does not exist.",
    },
    "TypeError": {
        "title": "An operation received an incompatible type",
        "severity": "high",
        "simple": "Python cannot perform this operation with the values provided.",
        "technical": "The operation or function received an object whose type does not support the requested operation.",
        "cause": "Values such as strings, numbers, lists, and functions support different operations.",
        "fix": "Inspect the values' types and convert or handle them before performing the operation.",
        "prevention": [
            "Validate input types at boundaries.",
            "Use type hints to document expected values.",
            "Convert values explicitly instead of relying on assumptions.",
        ],
        "summary": "You learned that TypeError means an operation is incompatible with a value's type.",
    },
    "KeyError": {
        "title": "A dictionary key does not exist",
        "severity": "medium",
        "simple": "The code requested a key that is not present in the dictionary.",
        "technical": "Dictionary subscription raises KeyError when the requested key is absent.",
        "cause": "The key may be misspelled, optional, or not inserted yet.",
        "fix": "Check for the key first or use dictionary.get() when a default value is appropriate.",
        "prevention": [
            "Use get() for optional dictionary values.",
            "Validate required keys before processing data.",
            "Keep key names consistent.",
        ],
        "summary": "You learned that KeyError occurs when a dictionary lookup has no matching key.",
    },
    "ZeroDivisionError": {
        "title": "A number was divided by zero",
        "severity": "high",
        "simple": "The denominator has a value of zero, so the division cannot be completed.",
        "technical": "Python raises ZeroDivisionError because division by zero is undefined.",
        "cause": "The code does not validate the denominator before dividing.",
        "fix": "Check that the denominator is not zero before performing the division.",
        "prevention": [
            "Validate denominators before division.",
            "Handle zero as a meaningful input case.",
            "Return a clear message when division is not possible.",
        ],
        "summary": "You learned that ZeroDivisionError occurs when a division denominator is zero.",
    },
    "SyntaxError": {
        "title": "Python cannot parse the code",
        "severity": "high",
        "simple": "The code structure does not follow Python's syntax rules.",
        "technical": "The parser found an invalid token, missing delimiter, or incorrectly structured statement.",
        "cause": "A bracket, colon, quote, indentation, or keyword may be missing or misplaced.",
        "fix": "Inspect the reported line and the line immediately before it for a structural mistake.",
        "prevention": [
            "Use editor syntax highlighting and formatting.",
            "Close brackets and quotes as soon as you open them.",
            "Run small changes frequently.",
        ],
        "summary": "You learned that SyntaxError means Python cannot parse the program structure.",
    },
}


def _error_type(error_message: str | None) -> str:
    if not error_message:
        return "UnknownError"

    for name in ERROR_GUIDES:
        if name.lower() in error_message.lower():
            return name
    return "UnknownError"


def _run_python(code: str) -> tuple[str | None, int | None]:
    try:
        result = subprocess.run(
            [sys.executable, "-I", "-c", code],
            capture_output=True,
            text=True,
            timeout=3,
            check=False,
        )
    except (OSError, subprocess.TimeoutExpired):
        return None, None

    if result.returncode == 0 or not result.stderr.strip():
        return None, None

    line_match = re.search(r'File "<string>", line (\d+)', result.stderr)
    line_number = int(line_match.group(1)) if line_match else None
    return result.stderr.strip(), line_number


def _safe_correction(error_type: str, code: str) -> tuple[str | None, list[str]]:
    if error_type == "NameError":
        match = re.search(r"(?:print|return|len)\(\s*([A-Za-z_]\w*)\s*\)", code)
        if match and not re.search(rf"^\s*{re.escape(match.group(1))}\s*=", code, re.MULTILINE):
            variable = match.group(1)
            return f"{variable} = 0\n{code}", [
                f"Initialized {variable} before its first use.",
                "Kept the original statement after the initialization.",
            ]

    return None, []


def _practice(error_type: str) -> PracticeQuestion | None:
    questions = {
        "NameError": PracticeQuestion(
            question_id="name-error-001",
            concept="Defining variables before use",
            prompt="What line should be added before print(username) so the code runs?",
            starter_code="print(username)",
            expected_answer="username = 'Alex'",
            hint="Give username a value before printing it.",
        ),
        "IndexError": PracticeQuestion(
            question_id="index-error-001",
            concept="Zero-based indexing",
            prompt="Which index prints the last item?",
            starter_code="numbers = [10, 20, 30]\nprint(numbers[?])",
            expected_answer="2",
            hint="The first item uses index 0.",
        ),
        "KeyError": PracticeQuestion(
            question_id="key-error-001",
            concept="Safe dictionary lookup",
            prompt="Which method can read a missing key without raising KeyError?",
            starter_code="user = {}\nvalue = user.?(\"name\")",
            expected_answer="get",
            hint="Use the dictionary method that accepts a default value.",
        ),
    }
    return questions.get(error_type)


def analyze(request: DebugRequest) -> DebugResponse:
    error_message = request.error_message.strip() if request.error_message else None
    detected_line = None

    if not error_message and request.language.lower() == "python":
        error_message, detected_line = _run_python(request.code)

    error_type = _error_type(error_message)
    guide = ERROR_GUIDES.get(error_type)
    corrected_code, fix_explanation = _safe_correction(error_type, request.code)

    if guide is None:
        guide = {
            "title": "The program reported an error",
            "severity": "unknown",
            "simple": "The error needs more context before a precise explanation can be given.",
            "technical": "No supported error signature was found in the supplied message.",
            "cause": "The supplied error message may be incomplete or belong to another language/runtime.",
            "fix": "Provide the complete error message and traceback for a more precise diagnosis.",
            "prevention": ["Include the complete traceback when requesting debugging help."],
            "summary": "You learned that a complete error message helps identify the root cause.",
        }

    practice = _practice(error_type) if request.include_practice else None

    return DebugResponse(
        error_type=error_type,
        error_title=guide["title"],
        severity=guide["severity"],
        location=request.error_line or detected_line,
        simple_explanation=guide["simple"],
        technical_explanation=guide["technical"],
        root_cause=guide["cause"],
        suggested_fix=guide["fix"],
        corrected_code=corrected_code,
        fix_explanation=fix_explanation,
        prevention_tips=guide["prevention"],
        learning_summary=guide["summary"],
        practice=practice,
    )


def check_practice(question_id: str, answer: str) -> PracticeCheckResponse:
    all_questions = [_practice(error_type) for error_type in ERROR_GUIDES]
    question = next((item for item in all_questions if item and item.question_id == question_id), None)
    if question is None:
        raise ValueError("Practice question not found")

    normalized_answer = answer.strip().lower()
    expected = question.expected_answer.strip().lower()
    correct = normalized_answer == expected or (
        question_id == "name-error-001" and normalized_answer in {"username = 'alex'", 'username = "alex"'}
    )

    feedback = (
        "Correct. You applied the concept successfully."
        if correct
        else f"Not quite. Review the hint and remember: {question.expected_answer}."
    )
    return PracticeCheckResponse(
        question_id=question_id,
        correct=correct,
        feedback=feedback,
        expected_answer=question.expected_answer,
    )
