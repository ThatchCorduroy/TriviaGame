$(document).ready(function() {



function Trivia () {
    this.answer = '';
    this.answerset = [];
    this.question = '';


    this.questionset = {
        
        "title1": "plot1",
        "title2" : "plot2",
        "title3" : "plot3",
        "title4" : "plot4",
        "title5" : "plot5",
        "title6" : "plot6",
        "title7" : "plot7",
        "title8" : "plot8",
        "title9" : "plot9",
        "title10" : "plot10",
        "title11" : "plot11",
        "title12" : "plot12",
        "title13" : "plot13",
        "title14" : "plot14",
        "title15" : "plot15",
        "title16" : "plot16",
        "title17" : "plot17",
        "title18" : "plot18",
        "title19" : "plot19",
        "title20" : "plot20",
        "title21" : "plot21",
        "title22" : "plot22",
        "title23" : "plot23",
        "title24" : "plot24",
        "title25" : "plot25",
    };

    this.setAnswer = function() {
        this.answerset = this.randomize(Object.keys(this.questionset));
        this.answerset = this.answerset.slice(0, 4);
        this.answer = this.answerset[Math.floor(Math.random() * Math.floor(4))];
    }

    this.getAnswerSet = function() {
        return this.answerset;
    }

    this.getAnswer = function() {
        return this.answer;
    }

    this.getPlot = function() {
        return this.questionset[this.answer];
    }

    this.randomize = function(arr) {
        var currentIndex = arr.length, temporaryValue, randomIndex;
        
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
    };

    this.setAnswer();
};

function Game () {
    this.turns = [];

    this.questionCount = 10;

    this.correctans = 0;
    this.incorrectans = 0;
    this.missedans = 0;

    this.secondTimerId;
    this.endTimeoutId;
    this.playTimeoutId;
    this.clickTimeoutId;


    this.createTurns = function() {
        for (i=0; i<10; i++) {
            this.turns.push(new Trivia);
        };
    }

    this.play = function() {
        console.log(this);
        if (this.turns.length > 0) {
            this.questionCount--
            this.turn();

            this.endTimerId = setTimeout(this.turnend.bind(this), 10 * 1000)
            
            var currentturn = this.turns.pop();
            //Call play recursively after 15 seconds
            //setTimeout(this.play.bind(this), 15 * 1000);



        } else {
            console.log("We've reached the end of the game");
            //show the ending page and reset
        }
    }



    this.turn = function() {

        that = this;
        console.log("the new turn has begun");
        
        for (i=0; i < 4; i++) {
            console.log(this.turns[this.questionCount].answerset[i]);
            $("#answer" + [i + 1]).text(this.turns[this.questionCount].answerset[i]);
        }
      
        var timer = 0;
        this.secondIntervalId = setInterval(function () {
            timer++;
            $("#remainingTime").text(timer);
        }, 1000);

        $(".answer").on("click", function() {
            that.turnend($(this).text());
            setTimeout(that.startPlay.bind(that), 5 * 1000);
            console.log("I saw the click");
            that.clickTimeoutId = setTimeout(that.play.bind(that), 5 * 1000);
        })
    };

    this.turnend = function(clicktext) {
        
                this.clearAllTimers();
        
                this.playTimeoutId = setTimeout(this.play.bind(this), 5 * 1000);
                
                $(".answer").hide();
        
                console.log(this.questionCount);
                console.log(this.turns.length);
         
                answer = this.turns[this.questionCount].answer;
                
        
                if (clicktext === answer) {
                    $("#question").text("Correct!");
                    this.correctans++;
                } else if (!clicktext) {
                    $("#question").text("You ran out of time!  The correct answer was " + answer + ".");
                    this.missedans++;
                } else {
                    $("question").text("Sorry, the correct answer was " + answer + ".");
                    this.incorrectans++;
                }
        
                this.turns.pop();
            };

    this.startPlay = function() {
        this.play();
        this.playIntervalId = setInterval(this.play.bind(this), 15 * 1000);
    };

    this.clearAllTimers = function() {
        clearTimeout(this.clickTimeoutId);
        clearTimeout(this.playTimeoutId);
        clearTimeout(this.endTimeoutId);
        clearInterval(this.secondTimerId);
    };

    this.answerClick = function() {

    };

    this.countdown = function() {
        var timer = 0

    };



    this.createTurns();
    this.startPlay();

};


newgame = new Game;
$("#remainingTime").css("visibility", "visible");
});