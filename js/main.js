$(function() {
    var curClueIdx = 0;
    var curGuess = "";
    var curClick = false;
    var guessedWords = [];
    var curPuzzleIdx;
    var clues;
    var answers;
    var fragments;

    function addFragment(fragment) {
        curGuess += fragment;
        for (var i = 0; i < curGuess.length; i++) {
            $(".letter").eq(i).html(curGuess.charAt(i));
        }
    }

    function checkWord(guess) {
        if (guess.toLowerCase() == answers[curClueIdx].toLowerCase()) {
            return true;
        }
        else {
            return false;
        }
    }

    function resetGuess() {
        curGuess = "";
        $(".letter").html("");
        $(".fragment:not(.hidden)").removeClass("selected")
                      .fadeTo(300, 1);
    }

    function getClue(curClueIdx) {
        $("#clue").html((curClueIdx+1) + ". " + clues[curClueIdx] +
                        " (" + answers[curClueIdx].length + " letters)");
        $(".letter").remove();
        for (var i = 0; i < answers[curClueIdx].length; i++) {
            $("#guess ul").append("<li class=\"letter\"></li>");
        }
    }

    function nextClue(guessed) {
        if (guessed) {
            guessedWords.push(curClueIdx)
            if (guessedWords.length == clues.length) {
                $("#clue").html("you win &hearts;<br>(click for new game)");
                $("#word-screen").click(newGame);
                return;
            }
        }
        do {
            curClueIdx = (curClueIdx + 1) % clues.length;
        } while (guessedWords.indexOf(curClueIdx) >= 0)
        getClue(curClueIdx);
    }

    function newGame() {
        $("#word-screen").unbind("click");
        $(".fragment").removeClass("hidden");
        resetGuess();
        guessedWords = [];
        curPuzzleIdx = Math.floor(Math.random() * puzzles.length);
        curPuzzle = puzzles[curPuzzleIdx];

        clues = curPuzzle.map(function(x) {return x.clue})
        fragments_list = curPuzzle.map(function(x) {return x.fragments});
        answers = fragments_list.map(function(x) {return x.join("")});
        // flatten fragments list
        fragments = [];
        fragments = fragments.concat.apply(fragments, fragments_list);
        console.log(fragments)
        shuffleFragments(fragments)
        getClue(0);
    }

    // Fisher-Yates Shuffle from Stack Overflow.
    function fyShuffle(array) {
      var currentIndex = array.length, temporaryValue, randomIndex ;

      // While there remain elements to shuffle...
      while (0 !== currentIndex) {

        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;

        // And swap it with the current element.
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
      }

      return array;
    }

    function shuffleFragments(curFragments) {
        if (!curFragments) {
            var curFragments = [];
            $(".fragment:not(.selected):not(.hidden)").each(function () {
                curFragments.push($(this).html());
            })
        }
        fyShuffle(curFragments);
        $(".fragment:not(.selected):not(.hidden)").each(function (i) {
            $(this).html(curFragments[i]);
        })
    }

    function setUp() {
        $(".fragment").click(function() {
            var fragment = $(this).html();
            if (!$(this).hasClass("selected") && !$(this).hasClass("hidden")
                && fragment.length <= $(".letter").length - curGuess.length) {
                addFragment(fragment);
                $(this).addClass("selected")
                       .css("cursor", "default")
                       .fadeTo(300, 0, function() {curClick = false});
            }
        })

        $("#submit").click(function() {
            if (checkWord(curGuess)) {
                $(".fragment.selected").addClass("hidden");
                nextClue(true);
            }
            resetGuess();
        })

        $("#reset").click(function() {
            resetGuess();
        });

        $("#skip").click(function() {
            resetGuess();
            nextClue(false);
        })

        $("#shuffle").click(function() {
            shuffleFragments();
        })

        newGame();
    }
    $.getJSON("assets/1000puzzles.json", function(data) {
        puzzles = data;
        setUp();
    });
})