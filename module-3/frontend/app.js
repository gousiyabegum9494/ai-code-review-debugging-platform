const API_URL = "http://127.0.0.1:8003";

const form = document.querySelector("#debug-form");
const emptyState = document.querySelector("#empty-state");
const result = document.querySelector("#result");
const formError = document.querySelector("#form-error");
const practiceCard = document.querySelector("#practice-card");
let activePractice = null;

function setText(selector, value) {
  document.querySelector(selector).textContent = value || "Not available.";
}

function setList(selector, items) {
  const list = document.querySelector(selector);
  list.replaceChildren(...items.map((item) => {
    const element = document.createElement("li");
    element.textContent = item;
    return element;
  }));
}

function showResult(data) {
  emptyState.classList.add("hidden");
  result.classList.remove("hidden");
  setText("#error-title", data.error_title);
  setText("#severity", data.severity.toUpperCase());
  setText("#simple-explanation", data.simple_explanation);
  setText("#root-cause", data.root_cause);
  setText("#suggested-fix", data.suggested_fix);
  setText("#location", data.location ? `Line ${data.location}` : "Location not supplied");
  setList("#fix-explanation", data.fix_explanation);
  setList("#prevention-tips", data.prevention_tips);
  setText("#learning-summary", data.learning_summary);

  const correctedCode = document.querySelector("#corrected-code");
  correctedCode.textContent = data.corrected_code || "No automatic code rewrite was generated. Follow the suggested fix above.";
  correctedCode.classList.remove("hidden");

  if (data.practice) {
    activePractice = data.practice;
    practiceCard.classList.remove("hidden");
    setText("#practice-concept", data.practice.concept);
    setText("#practice-prompt", data.practice.prompt);
    setText("#practice-code", data.practice.starter_code);
    setText("#practice-hint", `Hint: ${data.practice.hint}`);
    document.querySelector("#practice-answer").value = "";
    setText("#practice-feedback", "");
  } else {
    activePractice = null;
    practiceCard.classList.add("hidden");
  }
}

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.textContent = "";
  const button = form.querySelector("button[type=submit]");
  button.disabled = true;
  button.querySelector("span").textContent = "Analyzing...";

  const payload = {
    code: document.querySelector("#code").value,
    language: document.querySelector("#language").value,
    error_message: document.querySelector("#error-message").value.trim() || null,
    error_line: Number(document.querySelector("#error-line").value) || null,
    include_practice: document.querySelector("#include-practice").checked,
    experience_level: "beginner",
  };

  try {
    const response = await fetch(`${API_URL}/debug/analyze`, {
      body: JSON.stringify(payload),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error("The debugging service returned an error.");
    showResult(await response.json());
  } catch (error) {
    formError.textContent = `${error.message} Is the Module 3 backend running on port 8003?`;
  } finally {
    button.disabled = false;
    button.querySelector("span").textContent = "Analyze error";
  }
});

document.querySelector("#check-practice").addEventListener("click", async () => {
  if (!activePractice) return;
  const feedback = document.querySelector("#practice-feedback");
  const answer = document.querySelector("#practice-answer").value.trim();
  if (!answer) {
    feedback.textContent = "Write an answer first.";
    return;
  }
  try {
    const response = await fetch(`${API_URL}/debug/practice/check`, {
      body: JSON.stringify({ question_id: activePractice.question_id, answer }),
      headers: { "Content-Type": "application/json" },
      method: "POST",
    });
    if (!response.ok) throw new Error("Could not check this answer.");
    const data = await response.json();
    feedback.textContent = data.feedback;
    feedback.style.color = data.correct ? "#1b6b4a" : "#bd4c35";
  } catch (error) {
    feedback.textContent = error.message;
  }
});