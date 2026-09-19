import ast


def analyze_performance(code: str, filename: str = "code.py") -> list:
    issues = []

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return issues

    # Detect nested loops
    for node in ast.walk(tree):

        if isinstance(node, (ast.For, ast.While)):

            for child in ast.walk(node):

                if child is node:
                    continue

                if isinstance(child, (ast.For, ast.While)):
                    issues.append({
                        "file": filename,
                        "line": child.lineno,
                        "category": "Performance",
                        "severity": "Medium",
                        "title": "Nested loop detected",
                        "description": (
                            "A loop is nested inside another loop. "
                            "This may increase the time complexity "
                            "of the operation."
                        ),
                        "recommendation": (
                            "Check whether the nested loop can be "
                            "replaced with a dictionary, set, "
                            "indexed lookup, or another more "
                            "efficient approach."
                        ),
                        "confidence": 0.85
                    })

                    break

    # Detect repeated string concatenation in loops
    for node in ast.walk(tree):

        if isinstance(node, (ast.For, ast.While)):

            for child in ast.walk(node):

                if isinstance(child, ast.AugAssign):
                    if isinstance(child.op, ast.Add):
                        if isinstance(
                            child.target,
                            ast.Name
                        ):
                            issues.append({
                                "file": filename,
                                "line": child.lineno,
                                "category": "Performance",
                                "severity": "Low",
                                "title": (
                                    "Repeated string "
                                    "concatenation in loop"
                                ),
                                "description": (
                                    "Repeated string concatenation "
                                    "inside a loop may create "
                                    "unnecessary intermediate "
                                    "strings."
                                ),
                                "recommendation": (
                                    "Consider collecting strings "
                                    "in a list and using ''.join() "
                                    "after the loop."
                                ),
                                "confidence": 0.80
                            })

                            break

    # Detect repeated len() calls in loops
    for node in ast.walk(tree):

        if isinstance(node, (ast.For, ast.While)):

            len_calls = 0

            for child in ast.walk(node):

                if isinstance(child, ast.Call):
                    if isinstance(
                        child.func,
                        ast.Name
                    ):
                        if child.func.id == "len":
                            len_calls += 1

            if len_calls >= 2:
                issues.append({
                    "file": filename,
                    "line": node.lineno,
                    "category": "Performance",
                    "severity": "Low",
                    "title": "Repeated length calculation",
                    "description": (
                        "The loop repeatedly calculates collection "
                        "length, which may be unnecessary."
                    ),
                    "recommendation": (
                        "Consider calculating the length once "
                        "before the loop when appropriate."
                    ),
                    "confidence": 0.70
                })

    return issues