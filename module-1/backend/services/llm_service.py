import os

from dotenv import load_dotenv
from openai import OpenAI


load_dotenv()


def generate_ai_explanation(
    code: str,
    issue: dict
) -> str | None:
    api_key = os.getenv("OPENAI_API_KEY")
    model = os.getenv("OPENAI_MODEL")

    if not api_key or not model:
        return None

    try:
        client = OpenAI(api_key=api_key)

        prompt = f"""
You are an expert software code reviewer.

Analyze the following detected code issue and provide a
clear explanation for a developer.

File: {issue.get("file")}
Line: {issue.get("line")}
Category: {issue.get("category")}
Severity: {issue.get("severity")}
Issue: {issue.get("title")}

Existing description:
{issue.get("description")}

Existing recommendation:
{issue.get("recommendation")}

Relevant source code:
{code}

Write a concise explanation in 2-4 sentences.

Explain:
1. What is wrong.
2. Why it is a problem.
3. What could happen if it is not fixed.
4. How the developer should approach fixing it.

Do not invent facts that are not supported by the code.
"""

        response = client.responses.create(
            model=model,
            input=prompt
        )

        return response.output_text.strip()

    except Exception as error:
        print(f"LLM explanation failed: {error}")
        return None