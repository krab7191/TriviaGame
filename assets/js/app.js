$(function () {
    optionDropdownHandlers();
    resetHandler();
    startHandler();
});
function optionDropdownHandlers() {
    console.log("Attaching dropdown handlers...");
    $(".dropdown-item").on("click", function (event) {
        var $button = $(event.target).closest(".dropdown").children('button');
        var text = event.target.innerText;    // Use vanilla JS to avoid pulling html entities, ie. &amp;
        game.changeOptions($button.attr("id"), text);
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
        game.init();
    });
}

var game = {
    // https://opentdb.com/api.php?amount=10&category=9&difficulty=easy&type=multiple
    apiRoot: "https://opentdb.com/api.php?",
    amount: "10",
    category: "9",
    difficulty: "easy",
    type: "multiple",
    url: this.apiRoot + "amount=" + this.amount + "&category=" + this.category + "&difficulty=" + this.difficulty + "&type=" + this.type,
    questions: [],
    changeOptions: function (buttonId, text) {
        console.log("Changing " + buttonId + " to: " + text);
        $("#"+buttonId).html(text); // Change button text
        this[buttonId] = text;      // Change game option properties
    },
    init: function () {
        console.log("game.init()");

    },
    reset: function () {
        console.log("game.reset()");

    },
    makeRequest: function () {
        console.log("Making ajax request...");

    }
};