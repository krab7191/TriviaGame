$(function () {
    optionDropdownHandlers();
    resetHandler();
    startHandler();
});
function optionDropdownHandlers() {
    console.log("Attaching dropdown handlers...");
    $(".dropdown-item").on("click", function (event) {
        var target = event.target;
        var text = target.innerText;    // Use vanilla JS to avoid pulling html entities, ie. &amp;
        game.changeOptions(target, text);
    });
}
function resetHandler() {
    console.log("Attaching reset handler...");
    $("#reset").on("click", function () {
        game.reset();
    });
}
function startHandler() {
    console.log("Attaching start handler...");
    $("#start").on("click", function () {
        game.setup();
        game.makeRequest();
    });
}

var game = {
    // https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
    apiRoot: "https://opentdb.com/api.php?",
    amount: "10",
    category: "9",
    difficulty: "easy",
    type: "multiple",
    url: "",
    questions: [],
    changeOptions: function (target, text) {
        var buttonId = $(target.closest('.dropdown')).children("button").attr("id"); // Get button ID
        $("#" + buttonId).html(text); // Change button text
        if (text === "Easy" || text === "Medium" || text === "Hard") {
            console.log("Changing " + buttonId + " to: " + text);
            this[buttonId] = text;      // Change difficulty property
        }
        else {  // Change category property
            var l = $(target).prev().length;
            var i = 0;
            while ((l = $(target).prev().length) != 0)  // Which child is it?
            {
                target = $(target).prev();
                i++;
            }
            this.category = i + 9;  // Set category to numerical for API call
            console.log("Changing category to: " + this.category + " (" + text + ")");
        }
    },
    init: function () {
        console.log("game.init()");
        $("#question-box").html(JSON.stringify(this.questions));
    },
    reset: function () {
        console.log("game.reset()");

    },
    setup: function () {
        console.log("game.setup()");
        var cat;
        // Use vanilla JS to avoid grabbing button text whitespace (with .html())
        if ($("#category")[0].innerText == "Category ") {
            cat = "General Knowledge";
        }
        else {
            cat = $("#category")[0].innerText;
        }
        $("#question-box").html("Getting " + this.difficulty + " questions for " + cat + "...");
        game.questions = [];
    },
    makeRequest: function () {
        this.url = this.apiRoot + "amount=" + this.amount + "&category=" + this.category + "&difficulty=" + this.difficulty + "&type=" + this.type;
        console.log("Making ajax request...");
        $.ajax({
            url: game.url,
            method: "GET"
        }).then(function (response) {
            var r = response.results;
            for (var i = 0; i < r.length; i++) {
                game.questions.push([r[i].question, r[i].correct_answer, r[i].incorrect_answers]);
            }
            game.init();
        });
    }
};