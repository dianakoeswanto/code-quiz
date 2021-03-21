var startButton = document.querySelector("#start-button");
var welcomeScreenSection = document.querySelector("#welcome-screen");
var quizSection = document.querySelector("#quiz");
var questionElement = document.querySelector(".question");
var choicesElement = document.querySelector(".answers");
var resultElement = document.querySelector("#result");
var clockElement = document.querySelector("#clock");

var questionNo = 0;
var score = 0;

var interval;

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
    buildQuiz();
    startTimer();
}

function startTimer() {
    var timeleft = 60;
    
    interval = setInterval(function(){
    timeleft--;

    clockElement.textContent = timeleft;
    
    if(timeleft <= 0)
        stopTimer();
    },1000);
}

function stopTimer() {
    clearInterval(interval);
}

function toggleWelcomeScreen() {
    var welcomeScreenDisplay = welcomeScreenSection.style.display
    welcomeScreenSection.style.display = welcomeScreenDisplay == "none" ? "block" : "none";
}

function buildQuiz() {
    // do {
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
        score++;
        resultElement.textContent = "Q" + (questionNo + 1) + ": correct";
    } else {
        // reduceTimer();
        resultElement.textContent = "Q" + (questionNo + 1) + ": wrong!";
    }

    if(questionNo == quizzes.length - 1) {
        stopTimer();
        //display score screen
    } else {
        questionNo++;
        buildQuiz();
    }
}



startButton.addEventListener("click", startQuiz);