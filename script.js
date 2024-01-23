document.addEventListener("DOMContentLoaded", function () {
  //====== countdown ==================================================================================================================================================

  // Get the countdown element
  var countdownElement = document.getElementById("countdown");

  // Get the initial time from the data-time attribute
  var initialTime =
    parseInt(document.querySelector(".exam").getAttribute("data-time"), 10) *
    60;

  // Set the initial time on the countdown element
  countdownElement.textContent = formatTime(initialTime);

  // Start the countdown
  var countdownInterval = setInterval(function () {
    initialTime--;
    countdownElement.textContent = formatTime(initialTime);

    // Check if the time has reached 0
    if (initialTime <= 0) {
      clearInterval(countdownInterval);
      // You can add any additional actions when the countdown reaches 0
      //   overlayElement.style.display = "block";
      //   examPopup.style.display = "block";
      showResults();
    } else {
      countdownElement.textContent = formatTime(initialTime);

      // Check if the time is about to finish (e.g., at 59 seconds)
      if (initialTime === 59) {
        countdownElement.classList.add("warning");
      }
    }
  }, 1000);
  function showResults() {
    // Your existing logic for showing the results
    // This part of the code will be executed when the time reaches 00:00
    const resultPopupButton = document.querySelector(".result-popup-js");
    // Trigger the click event on the resultPopupButton
    resultPopupButton.click();
  }
  // Function to format time in MM : SS format
  function formatTime(seconds) {
    var mins = Math.floor(seconds / 60);
    var secs = seconds % 60;
    return pad(mins) + ":" + pad(secs) + " Mins";
  }

  // Function to add leading zero if needed
  function pad(value) {
    return value < 10 ? "0" + value : value;
  }
  //========================================================================================================================================================
  const questions = document.querySelectorAll(".question__box");
  const progressElements = document.querySelectorAll(".question__progress");

  let currentQuestionIndex = 0;
  const statsSliderNumbers = document.querySelector(".stats__slider-numbers");

  function showQuestion(index) {
    questions.forEach((question, i) => {
      if (i === index) {
        question.classList.add("active");
      } else {
        question.classList.remove("active");
      }
    });

    // Remove the stats__slider-current class from the previous active question
    const prevActiveNumber = statsSliderNumbers.querySelector(
      ".stats__slider-current"
    );
    if (prevActiveNumber) {
      prevActiveNumber.classList.remove("stats__slider-current");
    }

    // Add the stats__slider-current class to the current question
    const currentQuestionNumber = statsSliderNumbers.querySelector(
      `.stats__slider-number:nth-child(${index + 1})`
    );
    if (currentQuestionNumber) {
      currentQuestionNumber.classList.add("stats__slider-current");
    }

    // Оновлення відповідного .question__progress
    progressElements.forEach((progress, i) => {
      progress.textContent = `Question ${index + 1} of ${questions.length}`;
    });
    const currentQuestion = questions[index];
    const textboxInput = currentQuestion.querySelector(".question__textbox");

    if (textboxInput) {
      // Set focus to the text box
      textboxInput.focus();
    }
  }

  function nextQuestion() {
    if (currentQuestionIndex < questions.length - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
      updateSliderNumbersDisplay();

      // Check if the current question is the last one
      if (currentQuestionIndex === questions.length - 1) {
        // If it is the last question, hide or disable the "NEXT" button
        nextButton.style.display = "none"; // or nextButton.disabled = true;
      }
    }
  }

  function prevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
      updateSliderNumbersDisplay();

      // Check if the "NEXT" button was hidden or disabled
      if (!nextButton.style.display || nextButton.style.display === "none") {
        // If so, show or enable it again
        nextButton.style.display = "block"; // or nextButton.disabled = false;
      }
    }
  }

  const nextButton = document.querySelector(".question__next");
  const prevButton = document.querySelector(".question__prev");

  nextButton.addEventListener("click", nextQuestion);
  prevButton.addEventListener("click", prevQuestion);

  const questionImageWrap = document.querySelector(".question__image-wrap");
  const overlay = document.getElementById("overlay");
  const closeImageBtn = document.querySelector(".close-image-js");
  const examPopup = document.querySelector(".exam__popup");
  const finishButton = document.querySelector(".stats__finish-button");

  // Add click event listener to question__image-wrap
  questionImageWrap.addEventListener("click", function () {
    // Add the 'enlarged' class to question__image-wrap
    questionImageWrap.classList.add("enlarged");

    // Show the overlay
    overlay.style.display = "block";
  });

  // Add click event listener to close-image-js
  if (closeImageBtn) {
    closeImageBtn.addEventListener("click", function () {
      // Remove the 'enlarged' class from question__image-wrap
      questionImageWrap.classList.remove("enlarged");

      // Hide the overlay
      overlay.style.display = "none";
    });
  }
  finishButton.addEventListener("click", function () {
    overlay.style.display = "block";
    examPopup.style.display = "block";
  });

  // Додайте обробники подій для всіх елементів з класом .close-popup-js
  const closePopups = document.querySelectorAll(".close-popup-js");

  closePopups.forEach((closePopup) => {
    closePopup.addEventListener("click", function () {
      closeOverlayAndPopup();
    });
  });

  document.addEventListener("click", function (event) {
    if (event.target.classList.contains("close-image-js")) {
      // Remove the 'enlarged' class from question__image-wrap
      questionImageWrap.classList.remove("enlarged");

      // Hide the overlay
      overlay.style.display = "none";
    }
  });

  // Додайте обробник події для оверлею
  overlay.addEventListener("click", function (event) {
    // Check if the click occurred outside of question__image-wrap
    if (
      event.target !== questionImageWrap &&
      !questionImageWrap.contains(event.target)
    ) {
      // Remove the 'enlarged' class from question__image-wrap
      questionImageWrap.classList.remove("enlarged");

      // Hide the overlay
      overlay.style.display = "none";
    }
  });

  // Функція для закриття оверлею та попапу
  function closeOverlayAndPopup() {
    overlay.style.display = "none";
    examPopup.style.display = "none";
  }
  const resultPopupButton = document.querySelector(".result-popup-js");
  const resultContainer = document.querySelector(".result__container");

  resultPopupButton.addEventListener("click", function () {
    // Select the result container
    const resultContainer = document.querySelector(".result__container");

    // Clear previous results

    // Create a common parent element for all result__stats-item elements
    const resultStats = document.createElement("div");
    resultStats.classList.add("result__stats");

    // Create a container for the Knowledge Deficiency Report
    const knowledgeDeficiencyContainer = document.querySelector(
      ".result__right-list"
    );
    knowledgeDeficiencyContainer.innerHTML = "";
    const uniqueSyllabusNumbers = [];
    // Iterate over each question

    function compareAnswers(userAnswer, correctAnswer) {
      const formattedUserAnswer = userAnswer.replace(/\s/g, ""); // Remove spaces
      const formattedCorrectAnswer = correctAnswer.replace(/\s/g, "");

      return (
        formattedUserAnswer.toLowerCase() ===
        formattedCorrectAnswer.toLowerCase()
      );
    }

    function compareSelectAnswers(userAnswers, correctAnswers) {
      // Check if the user has selected the correct options
      return (
        userAnswers.length === correctAnswers.length &&
        userAnswers.every((userAnswer) => correctAnswers.includes(userAnswer))
      );
    }

    questions.forEach((question, index) => {
      // Get question title and correct answers
      const questionTitle = question.querySelector(".question__title").innerHTML;
  
      const correctAnswers = [];
      for (let i = 1; question.hasAttribute(`data-correct-${i}`); i++) {
          correctAnswers.push(question.getAttribute(`data-correct-${i}`));
      }
  
      // Get user's answers for checkbox questions
      const userAnswerElements = question.querySelectorAll("input:checked");
      const userAnswers = Array.from(userAnswerElements).map((input) =>
          input.nextElementSibling.innerText.trim()
      );
  
      // Get user's answers for select questions
      const selectElements = question.querySelectorAll(".question__select");
      const userSelectAnswers = Array.from(selectElements).map((select) =>
          select.value === "" ? "None" : select.value
      );
  
      let isCorrect =
          (userAnswers.length === correctAnswers.length &&
              correctAnswers.every((correctAnswer) =>
                  userAnswers.some((userAnswer) =>
                      compareAnswers(userAnswer, correctAnswer)
                  )
              )) ||
          compareSelectAnswers(userSelectAnswers, correctAnswers);
  
      const hasTextbox = question.querySelector(".question__textbox");
      let textboxUserAnswer = "";
      if (hasTextbox) {
          textboxUserAnswer = hasTextbox.value.trim().toLowerCase();
  
          const isNumericAnswer = !isNaN(parseFloat(correctAnswers[0]));
  
          if (isNumericAnswer) {
              // Convert user and correct answers to numeric values
              const correctAnswer = parseFloat(correctAnswers[0]);
              const userAnswer = parseFloat(textboxUserAnswer);
  
              // Check if the user's answer is within the acceptable range of the correct answer
              isCorrect =
                  isCorrect ||
                  (userAnswer >= Math.floor(correctAnswer) &&
                      userAnswer <= Math.ceil(correctAnswer));
          } else {
              // Check if the user's alphanumeric answer matches the correct answer exactly
              isCorrect =
                  isCorrect || compareAnswers(textboxUserAnswer, correctAnswers[0]);
          }
      }
  
      // Create result entry for incorrect answers
      if (!isCorrect) {
          const resultStatsItem = document.createElement("div");
          resultStatsItem.classList.add("result__stats-item");
  
          resultStatsItem.innerHTML = `
      <div class="result__stats-question">${questionTitle}</div>
      <div class="result__stats-tag">Wrong</div>
      <div class="result__stats-answers">
        <div class="result__stats-answer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18 6L6 18" stroke="#E84C94" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
            <path d="M6 6L18 18" stroke="#E84C94" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="result__stats-answer-title">Your Answer: <span class="result__stats-you-js">${
              userAnswers.join(", ") ||
              userSelectAnswers.join(", ") ||
              textboxUserAnswer ||
              "None"
          }</span></div>
        </div>
        <div class="result__stats-answer">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M20 6L9 17L4 12" stroke="#25B033" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
          </svg>
          <div class="result__stats-answer-title">Correct Answer: <span class="result__stats-correct-js">${correctAnswers.join(
              ", "
          )}</span></div>
        </div>
      </div>
    `;
  
          // Append the result entry to the common parent element
          resultStats.appendChild(resultStatsItem);
  
          // Add syllabus number and link to the Knowledge Deficiency Report
          // Отримайте значення data-syllabus
          const syllabusNumber = question.getAttribute("data-syllabus");
          const syllabusLink = question.getAttribute("data-syllabus-link");
  
          // Перевірте, чи це унікальне значення
          if (
              syllabusNumber &&
              syllabusLink &&
              !uniqueSyllabusNumbers.includes(syllabusNumber)
          ) {
              // Додаємо унікальне значення до масиву
              uniqueSyllabusNumbers.push(syllabusNumber);
  
              // Створюємо елемент і додаємо його до контейнера
              const deficiencyItem = document.createElement("li");
              deficiencyItem.innerHTML = `
    <a href="${syllabusLink}">
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="#2ED1DF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M12 16L16 12L12 8" stroke="#2ED1DF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
    <path d="M8 12H16" stroke="#2ED1DF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  </svg>
      ${syllabusNumber}
    </a>
  `;
              knowledgeDeficiencyContainer.appendChild(deficiencyItem);
          }
      }
  });
  

    // Get the "Examination" element
    const resultExaminationElement =
      document.getElementById("result-examination");
    // Get the "License" element
    const resultLicenseElement = document.getElementById("result-license");
    // Get the "Specialisation" element
    const resultSpecialisationElement = document.getElementById(
      "result-specialisation"
    );

    const examElement = document.querySelector(".exam");
    const userScore = totalQuestions - resultStats.childElementCount;
    const passRate = parseInt(examElement.getAttribute("data-pass-rate"));
    const examTitle = examElement.getAttribute("data-exam-title");
    const examLicense = examElement.getAttribute("data-exam-licence");
    const specialisation = examElement.getAttribute("data-specialisation");

    // Set the content of the elements with the obtained values
    resultExaminationElement.textContent = examTitle;
    resultLicenseElement.textContent = examLicense;
    resultSpecialisationElement.textContent = specialisation;

    // Calculate the percentage and determine the background color
    const percentage = (userScore / totalQuestions) * 100;

    const backgroundColor =
      userScore > 0 && percentage < passRate
        ? "#e84c94" // Red for scores greater than 0 but less than the pass rate
        : "#3aae81"; // Green for scores greater than or equal to the pass rate

    const passStatus = percentage >= passRate ? "Passed" : "Not Passed";
    const passStatusColor = percentage >= passRate ? "#25B033" : "#E84C94";

    // Add a class based on user's score
    const resultProgressBarClass =
      userScore === 0 ? "result__progress-bar-empty" : "result__progress-bar";

    // Create and append the progress bar to the result container
    const resultProgress = document.querySelector(".result__progress");
    resultProgress.innerHTML = `
<span style="width: ${percentage}%; background: ${backgroundColor}; " class="${resultProgressBarClass}">
<span class="result__progress-text">
Correct answers: 
    <span class="result__progress-number">${userScore} <span>(${percentage.toFixed(
      0
    )}%)</span></span>
</span>
    
</span>
`;

    // Update the "Marks" section with pass/fail status
    const resultMarks = document.getElementById("result-marks");
    resultMarks.innerHTML = `${percentage.toFixed(
      0
    )}, <span class="passed" style="color: ${passStatusColor}">${passStatus}</span>`;

    // Append the common parent element to the result container
    resultContainer.appendChild(resultStats);

    // Hide exam container, overlay, and exam popup
    const examContainer = document.querySelector(".exam__container");
    const overlay = document.getElementById("overlay");
    const examPopup = document.querySelector(".exam__popup");
    examContainer.style.display = "none";
    overlay.style.display = "none";
    examPopup.style.display = "none";
    resultContainer.style.display = "block";
  });

  function calculateElementsPerPage() {
    return window.innerWidth >= 479.98 ? 5 : 3;
  }

  // Select the stats__slider-numbers container
  const totalQuestions = questions.length;
  let elementsPerPage = calculateElementsPerPage();
  let firstVisibleElementIndex = 0;

  function updateSliderNumbersDisplay() {
    const lastVisibleElementIndex = Math.min(
      firstVisibleElementIndex + elementsPerPage - 1,
      totalQuestions - 1
    );

    statsSliderNumbers.innerHTML = "";

    // Calculate the first visible index based on the current question
    if (
      currentQuestionIndex <=
      totalQuestions - Math.ceil(elementsPerPage / 2)
    ) {
      firstVisibleElementIndex = Math.max(
        0,
        currentQuestionIndex - Math.floor(elementsPerPage / 2)
      );
    } else {
      firstVisibleElementIndex = totalQuestions - elementsPerPage;
    }

    for (
      let i = firstVisibleElementIndex;
      i < firstVisibleElementIndex + elementsPerPage;
      i++
    ) {
      if (i < totalQuestions) {
        const questionNumber = document.createElement("button");
        questionNumber.classList.add("stats__slider-number");
        questionNumber.textContent = i + 1;

        if (isQuestionAnswered(i)) {
          questionNumber.classList.add("stats__slider-finished");
        }

        if (i === currentQuestionIndex) {
          questionNumber.classList.add("stats__slider-current");
        }

        questionNumber.addEventListener("click", function () {
          if (i !== currentQuestionIndex) {
            currentQuestionIndex = i;
            showQuestion(currentQuestionIndex);
            updateSliderNumbersDisplay();
          }
        });

        statsSliderNumbers.appendChild(questionNumber);
      }
    }
  }

  function isQuestionAnswered(index) {
    const question = questions[index];

    // Перевірте наявність відповідей користувача для різних типів питань
    const hasRadioAnswer = question.querySelector(
      "input[type='radio']:checked"
    );
    const hasCheckboxAnswer = question.querySelector(
      "input[type='checkbox']:checked"
    );
    const hasSelectAnswer = Array.from(
      question.querySelectorAll(".question__select")
    ).some((select) => select.value !== "");
    const hasTextboxAnswer =
      question.querySelector(".question__textbox") &&
      question.querySelector(".question__textbox").value.trim() !== "";

    return (
      hasRadioAnswer || hasCheckboxAnswer || hasSelectAnswer || hasTextboxAnswer
    );
  }

  function generateUniqueIdsAndNames() {
    questions.forEach((question, index) => {
      const questionNumber = index + 1;
      const questionTitle = question.querySelector(".question__title");
      questionTitle.innerHTML = `<span class="question__number">${questionNumber}.</span> ${questionTitle.textContent}`;
      // Generate unique id for radio inputs
      const radioInputs = question.querySelectorAll(".question__radio");
      radioInputs.forEach((input, i) => {
        const uniqueId = `radio-${index + 1}-${i + 1}`;
        input.id = uniqueId;
        input.name = `radio-${index + 1}`;
        const label = input.closest("label"); // Find the closest label
        if (label) {
          label.setAttribute("for", uniqueId);
        }
      });

      // Generate unique id for checkbox inputs
      const checkboxInputs = question.querySelectorAll(".question__checkbox");
      checkboxInputs.forEach((input, i) => {
        const uniqueId = `checkbox-${index + 1}-${i + 1}`;
        input.id = uniqueId;
        const label = input.closest("label"); // Find the closest label
        if (label) {
          label.setAttribute("for", uniqueId);
        }
      });

      // Generate unique id for select inputs
      const selectInputs = question.querySelectorAll(".question__select");
      selectInputs.forEach((select, i) => {
        const uniqueId = `select-${index + 1}-${i + 1}`;
        select.id = uniqueId;
        select.name = `select-${index + 1}`;
      });

      // Generate unique id for textbox inputs
      const textboxInput = question.querySelector(".question__textbox");
      if (textboxInput) {
        const uniqueId = `textbox-${index + 1}`;
        textboxInput.id = uniqueId;
        textboxInput.name = `textbox-${index + 1}`;
      }
    });
  }

  generateUniqueIdsAndNames();

  const nextSliderButton = document.getElementById("stats__slider-next");
  const prevSliderButton = document.getElementById("stats__slider-prev");

  nextSliderButton.addEventListener("click", function () {
    if (currentQuestionIndex + 1 < totalQuestions) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
      updateSliderNumbersDisplay();
    }
  });

  prevSliderButton.addEventListener("click", function () {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
      updateSliderNumbersDisplay();
    }
  });

  // Event listener for window resize to update the display accordingly
  window.addEventListener("resize", function () {
    const newElementsPerPage = calculateElementsPerPage();

    if (newElementsPerPage !== elementsPerPage) {
      elementsPerPage = newElementsPerPage;
      updateSliderNumbersDisplay();
    }
  });
  // Get the "Date of Exam" element
  const resultDateElement = document.getElementById("result-date");

  // Get the current date
  const currentDate = new Date();

  // Format the date as "DD MMMM YYYY"
  const day = currentDate.getDate();
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];
  const monthIndex = currentDate.getMonth();
  const year = currentDate.getFullYear();

  const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

  // Set the formatted date to the "Date of Exam" element
  resultDateElement.textContent = formattedDate;
  // Initial call to update the number of displayed elements
  updateSliderNumbersDisplay();

  // Show the first question as current on page load
  showQuestion(currentQuestionIndex);
});
