import json
import subprocess
import tempfile
from pathlib import Path


def run_semgrep(code: str, filename: str = "code.py") -> list:
    issues = []

    suffix = Path(filename).suffix or ".py"

    try:
        with tempfile.NamedTemporaryFile(
            mode="w",
            suffix=suffix,
            delete=False,
            encoding="utf-8"
        ) as temp_file:
            temp_file.write(code)
            temp_path = temp_file.name

        command = [
            "semgrep",
            "--config=auto",
            "--json",
            "--quiet",
            temp_path
        ]

        result = subprocess.run(
            command,
            capture_output=True,
            text=True,
            timeout=60
        )

        if result.returncode not in (0, 1):
            return issues

        data = json.loads(result.stdout or "{}")

        for finding in data.get("results", []):
            extra = finding.get("extra", {})

            issues.append({
                "file": filename,
                "line": finding.get("start", {}).get("line", 1),
                "category": "Semgrep",
                "severity": _map_severity(
                    extra.get("severity")
                ),
                "title": extra.get(
                    "message",
                    "Semgrep detected a potential issue."
                ),
                "description": extra.get(
                    "message",
                    "Semgrep detected a potential issue."
                ),
                "recommendation": (
                    extra.get("metadata", {})
                    .get("fix", "Review and fix the reported issue.")
                ),
                "confidence": 0.90
            })

    except (
        subprocess.TimeoutExpired,
        json.JSONDecodeError,
        FileNotFoundError,
        OSError
    ):
        pass

    finally:
        try:
            Path(temp_path).unlink(missing_ok=True)
        except Exception:
            pass

    return issues


def _map_severity(severity: str | None) -> str:
    if not severity:
        return "Medium"

    severity = severity.upper()

    if severity == "ERROR":
        return "High"

    if severity == "WARNING":
        return "Medium"

    if severity == "INFO":
        return "Low"

    return "Medium"