import ast


def analyze_bugs(code: str, filename: str = "code.py") -> list:
    issues = []

    try:
        tree = ast.parse(code)
    except SyntaxError as error:
        issues.append({
            "file": filename,
            "line": error.lineno or 1,
            "category": "Bug",
            "severity": "High",
            "title": "Syntax error",
            "description": (
                "The source code contains a Python syntax error "
                "and cannot be executed."
            ),
            "recommendation": (
                "Fix the syntax error before running the program."
            ),
            "confidence": 1.0
        })
        return issues

    # Detect division by zero with obvious numeric zero.
    for node in ast.walk(tree):
        if isinstance(node, ast.BinOp) and isinstance(
            node.op, (ast.Div, ast.FloorDiv, ast.Mod)
        ):
            if isinstance(node.right, ast.Constant):
                if node.right.value == 0:
                    issues.append({
                        "file": filename,
                        "line": node.lineno,
                        "category": "Bug",
                        "severity": "High",
                        "title": "Division by zero",
                        "description": (
                            "The expression attempts to divide or "
                            "calculate a remainder using zero."
                        ),
                        "recommendation": (
                            "Check that the divisor is not zero "
                            "before performing the operation."
                        ),
                        "confidence": 1.0
                    })

    # Collect names that are defined in the code.
    defined_names = set()

    for node in ast.walk(tree):

        # Variables assigned with =
        if isinstance(node, ast.Assign):
            for target in node.targets:
                if isinstance(target, ast.Name):
                    defined_names.add(target.id)

        # Variables assigned with annotations
        elif isinstance(node, ast.AnnAssign):
            if isinstance(node.target, ast.Name):
                defined_names.add(node.target.id)

        # Walrus operator :=
        elif isinstance(node, ast.NamedExpr):
            if isinstance(node.target, ast.Name):
                defined_names.add(node.target.id)

        # Function arguments
        elif isinstance(
            node,
            (ast.FunctionDef, ast.AsyncFunctionDef)
        ):
            for argument in node.args.args:
                defined_names.add(argument.arg)

            for argument in node.args.kwonlyargs:
                defined_names.add(argument.arg)

            if node.args.vararg:
                defined_names.add(node.args.vararg.arg)

            if node.args.kwarg:
                defined_names.add(node.args.kwarg.arg)

        # Import statements
        elif isinstance(node, ast.Import):
            for alias in node.names:
                defined_names.add(
                    alias.asname or alias.name.split(".")[0]
                )

        elif isinstance(node, ast.ImportFrom):
            for alias in node.names:
                if alias.name != "*":
                    defined_names.add(
                        alias.asname or alias.name
                    )

        # For loop variables
        elif isinstance(node, (ast.For, ast.AsyncFor)):
            target = node.target

            if isinstance(target, ast.Name):
                defined_names.add(target.id)

            elif isinstance(target, (ast.Tuple, ast.List)):
                for element in target.elts:
                    if isinstance(element, ast.Name):
                        defined_names.add(element.id)

    # Common Python built-ins.
    builtin_names = {
        "print",
        "len",
        "range",
        "str",
        "int",
        "float",
        "list",
        "dict",
        "set",
        "tuple",
        "bool",
        "sum",
        "min",
        "max",
        "open",
        "input",
        "enumerate",
        "zip",
        "map",
        "filter",
        "abs",
        "round",
        "sorted",
        "reversed",
        "eval",
        "exec",
        "Exception",
        "ValueError",
        "TypeError",
        "KeyError",
        "IndexError",
        "True",
        "False",
        "None"
    }

    defined_names.update(builtin_names)

    # Detect possible undefined variables.
    for node in ast.walk(tree):
        if isinstance(node, ast.Name):
            if isinstance(node.ctx, ast.Load):
                if node.id not in defined_names:
                    issues.append({
                        "file": filename,
                        "line": node.lineno,
                        "category": "Bug",
                        "severity": "Medium",
                        "title": "Possible undefined variable",
                        "description": (
                            f"The variable '{node.id}' may be used "
                            "before it is defined."
                        ),
                        "recommendation": (
                            f"Make sure '{node.id}' is defined before "
                            "it is used."
                        ),
                        "confidence": 0.80
                    })

    # Detect mutable default arguments.
    for node in ast.walk(tree):
        if isinstance(
            node,
            (ast.FunctionDef, ast.AsyncFunctionDef)
        ):
            defaults = list(node.args.defaults)

            for default in defaults:
                if isinstance(
                    default,
                    (ast.List, ast.Dict, ast.Set)
                ):
                    issues.append({
                        "file": filename,
                        "line": node.lineno,
                        "category": "Bug",
                        "severity": "Medium",
                        "title": "Mutable default argument",
                        "description": (
                            "A list, dictionary, or set is used as "
                            "a function default argument. Mutable "
                            "defaults are shared between function calls."
                        ),
                        "recommendation": (
                            "Use None as the default value and create "
                            "the mutable object inside the function."
                        ),
                        "confidence": 0.95
                    })

    return issues