from tree_sitter import Language, Parser
import tree_sitter_python as tspython


def parse_python_code(code: str) -> dict:
    """
    Parse Python source code using Tree-sitter.

    Returns basic syntax-tree information that can be
    used by the code review pipeline.
    """

    try:
        language = Language(tspython.language())
        parser = Parser(language)

        tree = parser.parse(code.encode("utf-8"))
        root_node = tree.root_node

        return {
            "success": True,
            "has_error": root_node.has_error,
            "root_type": root_node.type,
            "node_count": _count_nodes(root_node)
        }

    except Exception as error:
        return {
            "success": False,
            "has_error": True,
            "root_type": None,
            "node_count": 0,
            "error": str(error)
        }


def _count_nodes(node) -> int:
    """
    Count nodes in the Tree-sitter syntax tree.
    """

    count = 1

    for child in node.children:
        count += _count_nodes(child)

    return count