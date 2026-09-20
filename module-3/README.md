# Module 3 - AI Debugging & Fix Generation

Module 3 explains programming errors, identifies likely root causes, generates a safe suggested fix when possible, and optionally provides practice.

## Run

```powershell
cd module-3\backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8003
```

API documentation is available at `http://127.0.0.1:8003/docs`.

## Endpoints

### `POST /debug/analyze`

Request:

```json
{
  "code": "print(total)",
  "language": "Python",
  "error_message": "NameError: name 'total' is not defined",
  "error_line": 1,
  "include_practice": true,
  "experience_level": "beginner"
}
```

The response includes the error explanation, technical cause, suggested fix, prevention tips, learning summary, and an optional practice question.

### `POST /debug/practice/check`

Submit the answer to a practice question returned by `/debug/analyze`.

```json
{
  "question_id": "name-error-001",
  "answer": "username = 'Alex'"
}
```

## Integration boundaries

- Module 1 supplies the source file and language.
- Module 2 can supply review findings and diagnostics.
- Module 3 explains the issue and proposes a fix.
- Module 4 verifies the proposed code and reports whether it passes tests.

The current service uses deterministic educational rules for common Python errors. The diagnosis/fix service can later be replaced with an LLM provider without changing the API contract.
