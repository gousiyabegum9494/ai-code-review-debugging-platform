import ast
import re


def analyze_security(code: str, filename: str = "code.py") -> list:
    issues = []

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return issues

    # Detect dangerous function calls
    for node in ast.walk(tree):

        # Detect eval()
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id == "eval":
                    issues.append({
                        "file": filename,
                        "line": node.lineno,
                        "category": "Security",
                        "severity": "High",
                        "title": "Use of eval()",
                        "description": (
                            "eval() can execute dynamically supplied "
                            "Python code and may introduce security risks."
                        ),
                        "recommendation": (
                            "Avoid eval() and use safer alternatives "
                            "for processing input."
                        ),
                        "confidence": 0.95
                    })

        # Detect exec()
        if isinstance(node, ast.Call):
            if isinstance(node.func, ast.Name):
                if node.func.id == "exec":
                    issues.append({
                        "file": filename,
                        "line": node.lineno,
                        "category": "Security",
                        "severity": "High",
                        "title": "Use of exec()",
                        "description": (
                            "exec() can execute arbitrary Python code "
                            "and may introduce security vulnerabilities."
                        ),
                        "recommendation": (
                            "Avoid exec() whenever possible."
                        ),
                        "confidence": 0.95
                    })

    # Detect possible hardcoded secrets
    secret_patterns = [
        r'(?i)(api[_-]?key|secret[_-]?key|access[_-]?token|password)\s*=\s*["\'][^"\']+["\']'
    ]

    for line_number, line in enumerate(code.splitlines(), start=1):
        for pattern in secret_patterns:
            if re.search(pattern, line):
                issues.append({
                    "file": filename,
                    "line": line_number,
                    "category": "Security",
                    "severity": "High",
                    "title": "Possible hardcoded secret",
                    "description": (
                        "A possible API key, password, token, or secret "
                        "appears to be hardcoded in the source code."
                    ),
                    "recommendation": (
                        "Move secrets to environment variables or a secure "
                        "secret-management system."
                    ),
                    "confidence": 0.90
                })
                break

    return issues