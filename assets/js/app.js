
// Document ready
$(function () {
    handleSession();
    //Attach click handlers
    optionDropdownHandlers();
    startHandler();
});

function handleSession() {
    if (typeof (Storage) !== "undefined") {
        if (localStorage.getItem("token") != null) {
            if (localStorage.getItem("tokenTime") + 21600000000 < new Date().getTime()) {
                // 6 hours passed, get new token
                getToken();
            }
            // Use session storage
            game.token = localStorage.getItem('token');
        }
        else {
            // Get and store token
            getToken();
        }
    }
}

function getToken() {
    $.get({
        url: 'https://opentdb.com/api_token.php?command=request'
    }).then(function (response) {
        console.log(response);
        localStorage.token = response.token;
        localStorage.tokenTime = new Date().getTime();
        game.token = response.token;
    }, function () {
        // Get some internet connexxion
    });
}

// Handle user change difficulty and trivia category
function optionDropdownHandlers() {
    $(".dropdown-item").on("click", function (event) {
        var target = event.target;
        var text = target.innerText;    // Use vanilla JS to avoid pulling html entities, ie. &amp;
        game.changeOptions(target, text);
    });
}
// Attach click handler to begin quiz
function startHandler() {
    $("#start").on("click", function () {
        game.reset();
        game.setup();
        game.makeRequest();
    });
}

// Game object
var game = {
    apiRoot: "https://opentdb.com/api.php?",
    amount: "10",
    category: 9,      // API handles categories as numbers increasing from 9
    difficulty: "easy",
    type: "multiple",   // Add support for different quiz type later
    url: "",
    questions: [],      // Object to hold questions for current game
    currQuestion: 0,
    timerCount: 10,
    intervalId: null,
    token: "",        // API session token
    score: 0,
    changeOptions: function (target, text) {
        var buttonId = $(target.closest('.dropdown')).children("button").attr("id"); // Get button ID
        $("#" + buttonId).html(text); // Change button text
        if (text === "Easy" || text === "Medium" || text === "Hard") {
            game[buttonId] = text.toLowerCase();      // Change difficulty property, (API needs lower case)
        }
        else {  // Change category property
            var length = $(target).prev().length;
            var i = 0;
            while ((l = $(target).prev().length) != 0)  // Which child is it?
            {
                target = $(target).prev();
                i++;
            }
            game.category = i + 9;  // API categories start at 9...
        }
    },
    init: function () {
        $("#timer-box").html("");
        if (game.currQuestion == 10) {
            $("#timer-box").css("visibility", "hidden");
            $("#question-box").html("Game over! Score: " + game.score + "/10");
        }
        else {
            var cat = $("#category")[0].innerText;
            if (cat == "Category ") {
                $("#question-box").html("General Knowledge: " + game.difficulty);
            }
            else {
                $("#question-box").html(cat + ": " + game.difficulty);
            }
            $("#question-box").append("<br><br>" + game.questions[game.currQuestion][0] + "<br>");
            var rand = game.optionRandomizer();
            for (var i = 0; i < 4; i++) {
                $("#question-box").append("<br><div class='answer'>" + game.questions[game.currQuestion][2][rand[i]] + "</div>"); // Append answers to page in random order
            }
            $("#timer-box").append("<div id='timer'>Time remaining: 10</div>");
            $(".answer").on('click', function (event) {
                // Prevent clicking multiple choices
                $(".answer").off("click");
                game.chooseAnswer(event.target);
            });
            $("#timer-box").css("visibility", "visible");
            game.timer();
        }
    },
    chooseAnswer: function (target) {
        clearInterval(game.intervalId);
        game.timerCount = 10;
        var answer = $(target).html();
        if (answer === game.questions[game.currQuestion][1]) {
            $(target).css("background-color", "green");
            game.score++;
        }
        else {
            $(".answer:contains(" + game.questions[game.currQuestion][1] + ")").css("background-color", "green");
            $(target).css("background-color", "red");
            game.timerCount = 10;
        }
        game.currQuestion++;
        setTimeout(function () {
            game.init();
        }, 2000);
    },
    timer: function () {
        clearInterval(game.intervalId);
        game.intervalId = setInterval(game.countdown, 1000);
    },
    countdown: function () {
        game.timerCount--;
        if (game.timerCount < 4) {
            $("#timer").css("color", "red");
        }
        $("#timer").html("Time remaining: " + game.timerCount);
        // game.timerCount--;
        if (game.timerCount == 0) {
            clearInterval(game.intervalId);
            game.timerCount = 10;
            game.currQuestion++;
            setTimeout(function () {
                game.init();
            }, 2000);
        }
    },
    optionRandomizer: function () {                       // Modified Fisher-Yates shuffle
        var currentIndex = 4, temporaryValue, randomIndex;
        var arr = [0, 1, 2, 3];  // Always 4 possible answers (From API)
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
            // Pick a remaining element...
            randomIndex = Math.floor(Math.random() * currentIndex);
            currentIndex -= 1;

            // And swap it with the current element.
            temporaryValue = arr[currentIndex];
            arr[currentIndex] = arr[randomIndex];
            arr[randomIndex] = temporaryValue;
        }
        return arr;
    },
    reset: function () {
        clearInterval(game.intervalId);
        $("#question-box").html("");
        $("#timer-box").html("").css("visibility", "hidden");
        game.currQuestion = 0;
        game.timerCount = 10;
        game.intervalId = null;
        game.score = 0;
        game.url = "";
        game.questions.length = 0;
    },
    setup: function () {      // Tell user what the category and difficulty is
        var cat;
        // Use vanilla JS to avoid grabbing button text whitespace (as with .html())
        if ($("#category")[0].innerText == "Category ") {
            cat = "General Knowledge";
        }
        else {
            cat = $("#category")[0].innerText;
        }
        $("#question-box").html("Getting " + game.difficulty + " questions for " + cat + "...");
        game.questions.length = 0;  // Erase question array
    },
    makeRequest: function () {
        game.url = game.apiRoot + "amount=" + game.amount + "&category=" + game.category + "&difficulty=" + game.difficulty + "&type=" + game.type + "&token=" + game.token;
        $.get({
            url: game.url
        }).then(function (response) {
            if (response.response_code != 0) {
                if (response.response_code == 4) {
                    alert("No new questions in this category! Reseting your access token");
                    $.get({
                        url: 'https://opentdb.com/api_token.php?command=reset&token=' + localStorage.getItem("token")
                    }).then(function (response) {
                        console.log(response);
                    }, function () {
                        // Get some internet connexxion
                    });
                }
                if (response.response_code == 3) {
                    getToken();
                }
            }
            else {
                console.log(response);
                var r = response.results;
                for (var i = 0; i < r.length; i++) {
                    // Construct local question array
                    game.questions[i] = [r[i].question, r[i].correct_answer, r[i].incorrect_answers];
                    // Push correct answer in with false options for ease of display
                    game.questions[i][2].push(game.questions[i][1]);
                }
                game.init();
            }
        }, function () {
            alert("You need an internet connection to play!");
        });
    }
};