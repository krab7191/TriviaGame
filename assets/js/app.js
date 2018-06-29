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
        $(".dropdown-item").on("click", function () {
            var text = $(this)[0].innerText;    // Use vanilla JS to avoid pulling html entities, ie. &amp;
            console.log(text);
            var but = $(this).prev("div");
            console.log(but);

        });
    },

};