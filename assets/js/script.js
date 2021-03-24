var startButton = document.querySelector("#start-button");
var welcomeScreenSection = document.querySelector("#welcome-screen");
var quizSection = document.querySelector("#quiz");
var clockElement = document.querySelector("#clock");
var submitButton = document.querySelector("#submit-button");
var highscoreSection = document.querySelector("#highscore");
var mainSection = document.querySelector("#main");
var backtoGameButton = document.querySelector("#back-to-game-button");
var clearHighscoreButton = document.querySelector("#clear-highscores-button");
var viewHighscoreLink = document.querySelector("#view-highscore");

var questionNo = 0;
var interval;
var timeLeft = 60;
var timePenalty = 10;

/**
 * Questions for quiz
 */
var quizzes = [
    {
        question: "Inside which HTML element do we put the JavaScript?",
        choices: [
            "<javascript>",
            "<script>",
            "<scripting>",
            "<js>"
        ],
        answer: "<script>"
    },
    {
        question: "Where is the correct place to insert a JavaScript?",
        choices: [
            "The <head> section",
            "The <body> section",
            "The <footer> section",
            "Body <body> and <head>"
        ],
        answer: "The <body> section"
    },
    {
        question: "What is the correct syntax for referring to an external script called 'xxx.js'?",
        choices: [
            "<script href='xxx.js'>",
            "<script name='xxx.js'>",
            "<script src='xxx.js'>",
            "<script id='xxx.js'>"
        ],
        answer: "<script src='xxx.js'>"
    },
    {
        question: "How do you write 'Hello World' in an alert box?",
        choices: [
            "msg('Hello World');",
            "msgBox('Hello World');",
            "alert('Hello World');",
            "alertBox('Hello World');"
        ],
        answer: "alert('Hello World');"
    },
    {
        question: "How do you create a function in JavaScript?",
        choices: [
            "function = myFunction()",
            "function: myFunction()",
            "function myFunction()",
            "myFunction()"
        ],
        answer: "function myFunction()"
    }
]

/**
 * When user clicks 'starts quiz', questions will be shown and the timer will start
 */
function startQuiz() {
    toggleWelcomeScreen();

    nextQuestion();

    startTimer();
}

/**
 * Starts the timer: 60 seconds.
 */
function startTimer() {
    interval = setInterval(function(){
        timeLeft--;
        clockElement.textContent = timeLeft;
    
        if(timeLeft <= 0) {
            stopTimer();
            displayScore();
        }
            
    }, 1000) ;
}

/**
 * Stops timer
 */
function stopTimer() {
    clearInterval(interval);
}

/**
 * Reduces the timer when user enters a wrong answer
 */
function reduceTimer() {
    timeLeft = timeLeft - timePenalty;
    clockElement.textContent = timeLeft;
}

/**
 * Either show / hide welcome screen
 */
function toggleWelcomeScreen() {
    var display = welcomeScreenSection.style.display
    welcomeScreenSection.style.display = display == "none" ? "block" : "none";
}

/**
 * Displays next question in the quiz
 */
function nextQuestion() {
    quizSection.style.display = "block";

    var answerChoices = document.querySelector(".answers");
    answerChoices.innerHTML = "";

    var quiz = quizzes[questionNo];
    var questionLabel = "Q" + (questionNo + 1) + ": " + quiz.question;
    document.querySelector(".question").textContent = questionLabel;

    var questionUl = document.createElement("ul");
    answerChoices.appendChild(questionUl);
    for(var i = 0; i < quiz.choices.length; i++) {
        var li = document.createElement("li");
        answerChoices.appendChild(li);

        var answerButton = document.createElement("button");
        answerButton.textContent = quiz.choices[i];
        li.appendChild(answerButton);

        answerButton.addEventListener("click", checkAnswer);
    }
}

/**
 * Checks if a correct answer is clicked.
 * 
 * @param event - the answer button event
 */
function checkAnswer(event) {
    var resultEl = document.querySelector("#result");
    resultEl.style.display = "block";
    
    if(event.target.textContent == quizzes[questionNo].answer) {
        resultEl.textContent = "Q" + (questionNo + 1) + ": correct";
    } else {
        reduceTimer();
        resultEl.textContent = "Q" + (questionNo + 1) + ": wrong!";
    }

    if(questionNo == quizzes.length - 1) {
        stopTimer();
        displayScore();
        
    } else {
        questionNo++;
        nextQuestion();
    }
}

/**
 * Display form to enter user's initials once the game has ended
 */
function displayScore() {
    var clockElement = document.querySelector("#score");
    clockElement.innerHTML = timeLeft;

    var scoreScreenElement = document.querySelector("#done-screen");
    scoreScreenElement.style.display = 'block';

    quizSection.style.display = "none";
}

/**
 * Handler for when user has submitted their score
 */
function submitScore() {
    var initialEl = document.querySelector("#initials");
    if (initialEl.value === "") {
        alert("Please enter correct initial");
    } else {
        var namesSaved = JSON.parse(window.localStorage.getItem(timeLeft));
        if(namesSaved === null) {
            namesSaved = [initialEl.value];
        } else {
            namesSaved.push(initialEl.value);
        }
        window.localStorage.setItem(timeLeft, JSON.stringify(namesSaved));
    
        initialEl.value = '';
        showHighScoreList();
    }
}

/**
 * Handles event when user clicks on 'view highscore'
 */
function showHighScoreList() {
    stopTimer();
    mainSection.style.display = "none";
    welcomeScreenSection.style.display = "none";
    highscoreSection.style.display = "block";

    const orderedStorage = Object.keys(localStorage).sort(function(a, b){return b-a});

    var orderedScoreList = document.createElement("ol");
    orderedStorage.forEach(score => {
        var names = JSON.parse(localStorage.getItem(parseInt(score)));

        names.map(name => {
            var scoreLiEl = document.createElement("li");
            scoreLiEl.textContent = name + " - " + score;
            orderedScoreList.appendChild(scoreLiEl);
        });
    });
  
    document.querySelector("#score-list").innerHTML = orderedScoreList.outerHTML;
}

/**
 * Resets the screen to the beginning
 */
function resetScreen() {
    questionNo = 0;
    timeLeft = 60;
    clockElement.textContent = timeLeft
    
    mainSection.style.display = "block";
    welcomeScreenSection.style.display = "block";
    quizSection.style.display = "none";
    highscoreSection.style.display = "none";
    document.querySelector("#done-screen").style.display = "none";
    document.querySelector("#result").style.display = "none";
}

/**
 * Clear local storage i.e. all highscores are wiped
 */
function clearLocalStorage() {
    localStorage.clear();
    showHighScoreList();
}

/**
 * Initializes all event listeners
 */
function init() {
    resetScreen();
    startButton.addEventListener("click", startQuiz);
    submitButton.addEventListener("click", submitScore);
    backtoGameButton.addEventListener("click", resetScreen);
    clearHighscoreButton.addEventListener("click", clearLocalStorage);
    viewHighscoreLink.addEventListener("click", showHighScoreList);
}

init();