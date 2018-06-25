$(function () {
    game.init();
});

var game = {
    apiRoot: "https://opentdb.com/api.php?",
    amount: "10",
    category: "9",
    difficulty: "easy",
    type: "multiple",
    init: function () {
        console.log("Init()...");
        this.optionDropdownHandlers();
    },
    optionDropdownHandlers: function () {
        $(".diff").on("click", function (event) {
            var text = event.target.innerText;    // Use vanilla JS to avoid pulling html entities, ie. &amp;
            $("#diff").html(text);
            game.difficulty = text;
        });
        $(".cat").on("click", function (event) {
            var text = event.target.innerText;
            $("#cat").html(text);
            game.category = $(event.target).index() + 9; // API offsets options by 9 for some reason...
        });
    },

};