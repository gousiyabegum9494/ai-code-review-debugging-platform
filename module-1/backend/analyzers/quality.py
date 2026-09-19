import ast


def analyze_quality(code: str, filename: str = "code.py") -> list:
    issues = []

    try:
        tree = ast.parse(code)
    except SyntaxError:
        return issues

    # Detect long lines
    for line_number, line in enumerate(
        code.splitlines(),
        start=1
    ):
        if len(line) > 100:
            issues.append({
                "file": filename,
                "line": line_number,
                "category": "Code Quality",
                "severity": "Low",
                "title": "Long line",
                "description": (
                    "This line is longer than 100 characters "
                    "and may be difficult to read."
                ),
                "recommendation": (
                    "Break the line into smaller expressions "
                    "to improve readability."
                ),
                "confidence": 0.98
            })

    # Analyze functions
    for node in ast.walk(tree):
        if isinstance(
            node,
            (ast.FunctionDef, ast.AsyncFunctionDef)
        ):
            # Long function
            if len(node.body) > 30:
                issues.append({
                    "file": filename,
                    "line": node.lineno,
                    "category": "Code Quality",
                    "severity": "Medium",
                    "title": "Long function",
                    "description": (
                        "This function contains many statements "
                        "and may be difficult to maintain."
                    ),
                    "recommendation": (
                        "Consider splitting the function into "
                        "smaller, focused functions."
                    ),
                    "confidence": 0.90
                })

            # Too many parameters
            parameter_count = (
                len(node.args.posonlyargs)
                + len(node.args.args)
                + len(node.args.kwonlyargs)
            )

            if node.args.vararg:
                parameter_count += 1

            if node.args.kwarg:
                parameter_count += 1

            if parameter_count > 5:
                issues.append({
                    "file": filename,
                    "line": node.lineno,
                    "category": "Code Quality",
                    "severity": "Medium",
                    "title": "Too many function parameters",
                    "description": (
                        "This function accepts more than five "
                        "parameters, which can make it harder "
                        "to understand and maintain."
                    ),
                    "recommendation": (
                        "Consider grouping related parameters "
                        "into a data structure or class."
                    ),
                    "confidence": 0.92
                })

    # Detect deeply nested control structures.
    def check_nesting(node, depth=0):
        control_nodes = (
            ast.If,
            ast.For,
            ast.AsyncFor,
            ast.While,
            ast.Try,
            ast.With,
            ast.AsyncWith
        )

        current_depth = depth

        if isinstance(node, control_nodes):
            current_depth += 1

            if current_depth >= 3:
                issues.append({
                    "file": filename,
                    "line": node.lineno,
                    "category": "Code Quality",
                    "severity": "Medium",
                    "title": "Deep nesting",
                    "description": (
                        "The code contains three or more levels "
                        "of nested control structures."
                    ),
                    "recommendation": (
                        "Reduce nesting by extracting logic "
                        "into smaller functions or using "
                        "early returns."
                    ),
                    "confidence": 0.90
                })

        for child in ast.iter_child_nodes(node):
            check_nesting(child, current_depth)

    check_nesting(tree)

    # Detect unused-looking imports
    imported_names = []

    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            for alias in node.names:
                imported_names.append(
                    (
                        alias.asname or alias.name.split(".")[0],
                        node.lineno
                    )
                )

        elif isinstance(node, ast.ImportFrom):
            for alias in node.names:
                if alias.name != "*":
                    imported_names.append(
                        (
                            alias.asname or alias.name,
                            node.lineno
                        )
                    )

    used_names = {
        node.id
        for node in ast.walk(tree)
        if isinstance(node, ast.Name)
    }

    for name, line_number in imported_names:
        if name not in used_names:
            issues.append({
                "file": filename,
                "line": line_number,
                "category": "Code Quality",
                "severity": "Low",
                "title": "Possibly unused import",
                "description": (
                    f"The imported name '{name}' does not "
                    "appear to be used."
                ),
                "recommendation": (
                    f"Remove the import of '{name}' if it "
                    "is not required."
                ),
                "confidence": 0.85
            })

    return issues