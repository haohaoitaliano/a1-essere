(function () {
  "use strict";

  var questions = [
    { sentence: "Io ___ cinese.", options: ["sono", "sei", "è"], answer: 0 },
    { sentence: "Tu ___ italiano?", options: ["siamo", "sei", "sono"], answer: 1 },
    { sentence: "Maria ___ molto simpatica.", options: ["è", "sono", "siete"], answer: 0 },
    { sentence: "Noi ___ a Bologna.", options: ["siete", "sono", "siamo"], answer: 2 },
    { sentence: "Voi ___ studenti?", options: ["siamo", "siete", "sono"], answer: 1 },
    { sentence: "I miei genitori ___ in Cina.", options: ["siamo", "siete", "sono"], answer: 2 },
    { sentence: "Luca è un insegnante.", options: ["是", "很", "在"], answer: 0 },
    { sentence: "La casa è bella.", options: ["是", "很", "在"], answer: 1 },
    { sentence: "Marco è a casa.", options: ["很", "是", "在"], answer: 2 },
    { sentence: "I bambini sono felici.", options: ["在", "很", "是"], answer: 1 }
  ];

  var letters = ["A", "B", "C"];
  var currentIndex = 0;
  var isAnswered = false;

  var quizView = document.getElementById("quiz-view");
  var completionView = document.getElementById("completion-view");
  var progress = document.getElementById("progress");
  var progressBar = document.getElementById("progress-bar");
  var partLabel = document.getElementById("part-label");
  var instructionIt = document.getElementById("instruction-it");
  var instructionZh = document.getElementById("instruction-zh");
  var teachingNote = document.getElementById("teaching-note");
  var questionNumber = document.getElementById("question-number");
  var questionText = document.getElementById("question-text");
  var meaningPrompt = document.getElementById("meaning-prompt");
  var options = document.getElementById("options");
  var feedback = document.getElementById("feedback");
  var continueButton = document.getElementById("continue-button");
  var restartTop = document.getElementById("restart-top");
  var restartBottom = document.getElementById("restart-bottom");

  function renderQuestion() {
    var question = questions[currentIndex];
    var isPartTwo = currentIndex >= 6;

    isAnswered = false;
    progress.textContent = (currentIndex + 1) + " / " + questions.length;
    progressBar.style.width = ((currentIndex + 1) / questions.length * 100) + "%";
    partLabel.textContent = isPartTwo ? "PARTE 2" : "PARTE 1";
    instructionIt.textContent = isPartTwo
      ? "Che cosa significa ESSERE?"
      : "Scegli la forma corretta.";
    instructionZh.textContent = isPartTwo
      ? "请观察句子，选择 essere 在中文里的意思。"
      : "请选择 essere 的正确变位。";
    teachingNote.hidden = !isPartTwo;
    questionNumber.textContent = "DOMANDA " + (currentIndex + 1);
    questionText.textContent = question.sentence;
    questionText.classList.toggle("with-meaning", isPartTwo);
    meaningPrompt.hidden = !isPartTwo;
    meaningPrompt.textContent = isPartTwo
      ? "句子里的 " + (currentIndex === 9 ? "sono" : "è") + " 是什么意思？"
      : "";
    feedback.hidden = true;
    feedback.className = "feedback";
    feedback.textContent = "";
    continueButton.hidden = true;
    options.innerHTML = "";

    question.options.forEach(function (option, optionIndex) {
      var button = document.createElement("button");
      button.type = "button";
      button.className = "option-button";
      button.setAttribute("data-index", String(optionIndex));
      button.setAttribute("aria-label", letters[optionIndex] + ". " + option);

      var letter = document.createElement("span");
      letter.className = "option-letter";
      letter.setAttribute("aria-hidden", "true");
      letter.textContent = letters[optionIndex];

      var text = document.createElement("span");
      text.className = "option-text";
      text.textContent = option;

      var status = document.createElement("span");
      status.className = "option-status";
      status.setAttribute("aria-hidden", "true");
      status.textContent = "·";

      button.appendChild(letter);
      button.appendChild(text);
      button.appendChild(status);
      button.addEventListener("click", chooseAnswer);
      options.appendChild(button);
    });
  }

  function chooseAnswer(event) {
    if (isAnswered) {
      return;
    }

    var selectedButton = event.currentTarget;
    var selectedIndex = Number(selectedButton.getAttribute("data-index"));
    var question = questions[currentIndex];

    if (selectedIndex === question.answer) {
      isAnswered = true;
      selectedButton.classList.remove("is-wrong");
      selectedButton.classList.add("is-correct");
      selectedButton.querySelector(".option-status").textContent = "✓";
      feedback.textContent = "Bravissimo!";
      feedback.className = "feedback correct";
      feedback.hidden = false;
      continueButton.hidden = false;

      Array.prototype.forEach.call(options.children, function (button) {
        button.disabled = true;
      });
      continueButton.focus();
      return;
    }

    selectedButton.classList.add("is-wrong");
    selectedButton.querySelector(".option-status").textContent = "×";
    feedback.textContent = "Riprova!";
    feedback.className = "feedback wrong";
    feedback.hidden = false;
    selectedButton.setAttribute("aria-label", selectedButton.getAttribute("aria-label") + ", risposta errata");
  }

  function nextQuestion() {
    if (!isAnswered) {
      return;
    }

    if (currentIndex < questions.length - 1) {
      currentIndex += 1;
      renderQuestion();
      questionText.focus();
      window.scrollTo(0, 0);
      return;
    }

    quizView.hidden = true;
    completionView.hidden = false;
    restartTop.hidden = true;
    completionView.focus();
    window.scrollTo(0, 0);
  }

  function restart() {
    currentIndex = 0;
    isAnswered = false;
    completionView.hidden = true;
    quizView.hidden = false;
    restartTop.hidden = false;
    renderQuestion();
    window.scrollTo(0, 0);
  }

  questionText.setAttribute("tabindex", "-1");
  completionView.setAttribute("tabindex", "-1");
  continueButton.addEventListener("click", nextQuestion);
  restartTop.addEventListener("click", restart);
  restartBottom.addEventListener("click", restart);

  renderQuestion();
}());
