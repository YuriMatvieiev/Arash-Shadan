document.addEventListener("DOMContentLoaded", function () {
  //======== INPUT WIDTH ================================================================================================================================================

  var inputElement = document.getElementById("questionInput");
  if (inputElement) {
    inputElement.addEventListener("input", function () {
      adjustInputWidth(inputElement);
    });
    function adjustInputWidth(inputElement) {
      var inputLength = inputElement.value.length;

      var maxWidth = 150;

      var newWidth = Math.min(70 + inputLength * 8, maxWidth);

      inputElement.style.width = newWidth + "px";
    }
  }

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
    } else if (initialTime === 59) {
      countdownElement.classList.add("warning");
    }
  }, 1000);

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

  //========= OVERLAY===============================================================================================================================================

  const imageElement = document.querySelector(".question__image");
  const overlayElement = document.getElementById("overlay");
  const finishButton = document.querySelector(".stats__finish-button");
  const examPopup = document.querySelector(".exam__popup");
  const examContainer = document.querySelector(".exam__container");
  const resultContainer = document.querySelector(".result__container");
  const examPopupButton = document.querySelector(".result-popup-js");

  function hideElements() {
    examContainer.style.display = "none";
    resultContainer.style.display = "block";
    overlayElement.style.display = "none";
    examPopup.style.display = "none";
  }

  function showOverlay() {
    overlayElement.style.display = "block";
  }

  function hideOverlay() {
    overlayElement.style.display = "none";
  }

  if (imageElement) {
    imageElement.addEventListener("click", function () {
      imageElement.classList.add("enlarged");
      showOverlay();
    });

    overlayElement.addEventListener("click", function () {
      imageElement.classList.remove("enlarged");
      hideOverlay();
    });
  }

  finishButton.addEventListener("click", function () {
    examPopup.style.display = "block";
    showOverlay();
  });

  document.addEventListener("click", function (event) {
    if (
      event.target.classList.contains("close-popup-js") ||
      event.target === overlayElement
    ) {
      examPopup.style.display = "none";
      hideOverlay();
    }
  });

  examPopupButton.addEventListener("click", hideElements);

  const closePopupButtons = document.querySelectorAll(".result-popup-js");
  closePopupButtons.forEach((button) => {
    button.addEventListener("click", hideElements);
  });

  //========================================================================================================================================================

  const questionBoxes = document.querySelectorAll(".question__box");
  const progressElements = document.querySelectorAll(".question__progress");
  const statsSliderNumbers = document.querySelector(".stats__slider-numbers");
  const statsSliderPrev = document.getElementById("stats__slider-prev");
  const statsSliderNext = document.getElementById("stats__slider-next");

  let currentQuestionIndex = 0;
  const totalQuestions = questionBoxes.length;
  let numbersToShow = window.innerWidth <= 479.98 ? 3 : 5;
  let currentPosition = 0;

  function showQuestion(index) {
    questionBoxes.forEach((box, i) => {
      if (i === index) {
        box.classList.remove("hidden");
      } else {
        box.classList.add("hidden");
      }
    });

    updateProgress();
  }

  function updateProgress() {
    progressElements.forEach((progressElement) => {
      progressElement.textContent = `Question ${
        currentQuestionIndex + 1
      } of ${totalQuestions}`;
    });

    updateSliderNumbers();
  }

  function updateSliderNumbers() {
    statsSliderNumbers.innerHTML = "";

    for (let i = 0; i < totalQuestions; i++) {
      const sliderNumber = document.createElement("div");
      sliderNumber.classList.add("stats__slider-number");
      sliderNumber.textContent = i + 1;
      sliderNumber.addEventListener("click", () => goToQuestion(i));
      statsSliderNumbers.appendChild(sliderNumber);
    }

    updateVisibility();
  }

  function updateVisibility() {
    const sliderNumbers = document.querySelectorAll(".stats__slider-number");
    const totalNumbers = sliderNumbers.length;

    sliderNumbers.forEach((number, index) => {
      number.style.display =
        index >= currentPosition && index < currentPosition + numbersToShow
          ? "flex"
          : "none";
    });
  }

  function goToQuestion(index) {
    currentQuestionIndex = index;
    showQuestion(currentQuestionIndex);
    updateProgress();
  }

  statsSliderNext.addEventListener("click", function () {
    if (currentPosition + numbersToShow < totalQuestions) {
      currentPosition += 1;
      updateVisibility();
    }
  });

  statsSliderPrev.addEventListener("click", function () {
    if (currentPosition > 0) {
      currentPosition -= 1;
      updateVisibility();
    }
  });

  function updateNumbersToShow() {
    numbersToShow = window.innerWidth <= 479.98 ? 3 : 5;
    updateVisibility();
  }

  function goToNextQuestion() {
    if (currentQuestionIndex < totalQuestions - 1) {
      currentQuestionIndex++;
      showQuestion(currentQuestionIndex);
      updateProgress();
      updateNumbersToShow();
    }
  }

  function goToPrevQuestion() {
    if (currentQuestionIndex > 0) {
      currentQuestionIndex--;
      showQuestion(currentQuestionIndex);
      updateProgress();
      updateNumbersToShow();
    }
  }

  const nextButton = document.querySelector(".question__next");
  const prevButton = document.querySelector(".question__prev");

  nextButton.addEventListener("click", goToNextQuestion);
  prevButton.addEventListener("click", goToPrevQuestion);

  // Show the first question on page load
  showQuestion(currentQuestionIndex);

  // Update the number of slider numbers on window resize
  window.addEventListener("resize", updateNumbersToShow);

  //========================================================================================================================================================

  //========================================================================================================================================================
});
