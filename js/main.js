$(function() {
    var curClue = 0;
    var curGuess = "";
    var clues;
    var answers;
    curFragments = [];
    var guessedWords = [];

    function addFragment(fragment) {
        if (fragment.length <= $(".letter").length - curGuess.length) {
            curGuess += fragment;
            for (var i = 0; i < curGuess.length; i++) {
                $(".letter").eq(i).html(curGuess.charAt(i));
            }
            return true;
        }
        else {
            return false;
        }
    }

    function checkWord(guess) {
        if (guess.toLowerCase() == answers[curClue].toLowerCase()) {
            return true;
        }
        else {
            return false;
        }
    }

    function resetGuess(spentFragments) {
        if (spentFragments) {
            spentFragments.map(function(x) {$(x).remove()});
        }
        curGuess = "";
        $(".letter").html("");
        $(".fragment").fadeTo(300, 1);
    }

    function getClue(curClue) {
        $("#clue").html(clues[curClue]);
        $(".letter").remove();
        for (var i = 0; i < answers[curClue].length; i++) {
            $("#guess").append("<div class=\"letter\"></div>");
        }
    }

    function nextClue(guessed) {
        if (guessed) {
            guessedWords.push(curClue)
            if (guessedWords.length == clues.length) {
                $("#clue").html("you win!");
                return;
            }
        }
        do {
            curClue = (curClue + 1) % clues.length;
        } while (guessedWords.indexOf(curClue) >= 0)
        getClue(curClue);
    }
    
    function setUp() {
        clues = ["1. snowman in Frozen", "2. snowman in Frozen", "3. snowman in Frozen"];
        answers = ["olaf", "olafol", "afolaf"];
        
        getClue(0);
        
        $(".fragment").click(function() {
            if (addFragment($(this).html())) {
                $(this).fadeTo(300, 0).css("cursor", "default");
            }
            curFragments.push(this);
        })

        $("#submit").click(function() {
            if (checkWord(curGuess)) {
                resetGuess(curFragments);
                nextClue(true);
            }
        })

        $("#reset").click(function() {
            resetGuess();
        });

        $("#skip").click(function() {
            resetGuess();
            nextClue(false);
        })
    }
    setUp();
})