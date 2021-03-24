var startButton = document.querySelector("#start-button");
var welcomeScreenSection = document.querySelector("#welcome-screen");
var quizSection = document.querySelector("#quiz");
var questionElement = document.querySelector(".question");
var choicesElement = document.querySelector(".answers");
var resultElement = document.querySelector("#result");
var clockElement = document.querySelector("#clock");
var submitButton = document.querySelector("#submit-button");
var highscoreListEl = document.querySelector("#score-list");
var highscoreSection = document.querySelector("#highscore");
var mainSection = document.querySelector("#main");
var backtoGameButton = document.querySelector("#back-to-game-button");
var clearHighscoreButton = document.querySelector("#clear-highscores-button");

var questionNo = 0;

var interval;
var timeLeft = 60;
var timePenalty = 10;

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
function startQuiz() {
    toggleWelcomeScreen();

    nextQuestion();

    startTimer();
}

function startTimer() {
    interval = setInterval(function(){
        timeLeft--;
        clockElement.textContent = timeLeft;
    
        if(timeLeft <= 0)
            stopTimer();
    }, 1000) ;
}

function stopTimer() {
    clearInterval(interval);
}

function reduceTimer() {
    timeLeft = timeLeft - timePenalty;
    clockElement.textContent = timeLeft;
}

function toggleWelcomeScreen() {
    var welcomeScreenDisplay = welcomeScreenSection.style.display
    welcomeScreenSection.style.display = welcomeScreenDisplay == "none" ? "block" : "none";
}

function nextQuestion() {
    quizSection.style.display = "block";

    choicesElement.innerHTML = "";

    var quiz = quizzes[questionNo];
    var questionLabel = "Q" + (questionNo + 1) + ": " + quiz.question;
    questionElement.textContent = questionLabel;

    var questionUl = document.createElement("ul");
    choicesElement.appendChild(questionUl);
    for(var i = 0; i < quiz.choices.length; i++) {
        var li = document.createElement("li");
        choicesElement.appendChild(li);

        var answerButton = document.createElement("button");
        answerButton.textContent = quiz.choices[i];
        li.appendChild(answerButton);

        answerButton.addEventListener("click", checkAnswer);
    }
}

function checkAnswer(event) {

    if(event.target.textContent == quizzes[questionNo].answer) {
        resultElement.textContent = "Q" + (questionNo + 1) + ": correct";
    } else {
        reduceTimer();
        resultElement.textContent = "Q" + (questionNo + 1) + ": wrong!";
    }

    if(questionNo == quizzes.length - 1) {
        stopTimer();
        displayScore();
        
    } else {
        questionNo++;
        nextQuestion();
    }
}

function displayScore() {
    var clockElement = document.querySelector("#score");
    clockElement.innerHTML = timeLeft;

    var scoreScreenElement = document.querySelector("#done-screen");
    scoreScreenElement.style.display = 'block';

    quizSection.style.display = "none";
}

function submitScore() {
    var initial = document.querySelector("#initials");
    window.localStorage.setItem(initial.value, timeLeft);

    initial.value = '';
    showHighScoreList();
}

function showHighScoreList() {
    highscoreSection.style.display = "block";
    mainSection.style.display = "none";

    const sortableLocalStorage = Object.fromEntries(
        Object.entries(localStorage).sort(([,a],[,b]) => b-a)
    );
    
    var orderedScoreList = document.createElement("ol");
    for(var key in sortableLocalStorage) {
        var scoreLiEl = document.createElement("li");
        scoreLiEl.textContent = key + " - " + sortableLocalStorage[key];

        orderedScoreList.appendChild(scoreLiEl);
    }
  
    highscoreListEl.innerHTML = orderedScoreList.outerHTML;
}

function resetScreen() {
    questionNo = 0;
    timeLeft = 60;
    clockElement.textContent = timeLeft
    
    mainSection.style.display = "block";
    welcomeScreenSection.style.display = "block";
    quizSection.style.display = "none";
    highscoreSection.style.display = "none";
    document.querySelector("#done-screen").style.display = "none";
}

function clearLocalStorage() {
    localStorage.clear();

    showHighScoreList();
}

function init() {
    resetScreen();
    startButton.addEventListener("click", startQuiz);
    submitButton.addEventListener("click", submitScore);
    backtoGameButton.addEventListener("click", resetScreen);
    clearHighscoreButton.addEventListener("click", clearLocalStorage);
}

init();
// showHighScoreList();