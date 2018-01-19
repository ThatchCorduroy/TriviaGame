$(document).ready(function() {

        function Trivia (questionset) {
            console.log("here is one instance of trivia");
            this.answer = '';
            this.answerset = [];
            this.question = '';

            this.title;
            this.plot;
            this.poster;
            this.titleset = [];

            this.questionset = questionset;

            // this.questionset = {
                
            //     "title1": "plot1",
            //     "title2" : "plot2",
            //     "title3" : "plot3",
            //     "title4" : "plot4",
            //     "title5" : "plot5",
            //     "title6" : "plot6",
            //     "title7" : "plot7",
            //     "title8" : "plot8",
            //     "title9" : "plot9",
            //     "title10" : "plot10",
            //     "title11" : "plot11",
            //     "title12" : "plot12",
            //     "title13" : "plot13",
            //     "title14" : "plot14",
            //     "title15" : "plot15",
            //     "title16" : "plot16",
            //     "title17" : "plot17",
            //     "title18" : "plot18",
            //     "title19" : "plot19",
            //     "title20" : "plot20",
            //     "title21" : "plot21",
            //     "title22" : "plot22",
            //     "title23" : "plot23",
            //     "title24" : "plot24",
            //     "title25" : "plot25",
            // };

            this.setAnswer = function() {
                
                this.answerset = this.randomize(this.questionset);
                this.answerset = this.answerset.slice(0, 4);
                this.answer = this.answerset[Math.floor(Math.random() * Math.floor(4))];
                var index = this.questionset.indexOf(this.answer);
                this.questionset.splice(index, 1);

                 for (var i = 0; i < this.answerset.length; i++) {
                     this.apicall(this.answerset[i]);
                 }
                 console.log("done");

            };

            this.apicall = function (answerid) {

                var queryURL = "https://www.omdbapi.com/?i=" + answerid + "&y=&plot=short&apikey=trilogy";
                var that = this;
                $.ajax({
                url: queryURL,
                method: "GET"
                }).done(function(response) {
                    console.log(answerid, that.answer);
                    if (answerid === that.answer) {  
                        that.title = response.Title; 
                        that.plot = response.Plot;
                        that.poster = response.Poster;
                        that.titleset.push(response.Title);
                    } else {
                        that.titleset.push(response.Title);
                    }
                });
            };

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
            this.questionset = ["tt0088847", "tt0089886", "tt0088128", "tt0090305", "tt0091790", "tt0088763", "tt0096874", 
            "tt0080684", "tt0086190", "tt0084726", "tt0092007", "tt0083866", "tt0092890", "tt0091763",
            "tt0093779", "tt0082971", "tt0087469", "tt0097576", "tt0088247", "tt0096438", "tt0098635", 
            "tt0091369", "tt0089469", "tt0096928", "tt0092099"];

            this.turns = [];

            this.questionCount = 10;

            this.correctans = 0;
            this.incorrectans = 0;
            this.missedans = 0;

            this.secondTimerId;
            this.endTimeoutId;
            this.playTimeoutId;
            this.clickTimeoutId;
            this.turnEndCount = 0;

            this.turnTimes = 0;

            this.gameInterval;

            this.createTurns = function() {
                for (var i=0; i<10; i++) {
                    this.turns.push(new Trivia(this.questionset));
                    console.log(this.questionset);
                };
                console.log(this.turns);
            };

            this.play = function() {
                $("#start").hide();
                $(".answer").show();
                $("#result").hide();;
                $("#media").hide();
                $("#question").css("visibility", "visible");
                $("#remainingTime").css("visibility", "visible");
                console.log("This play", this);

                this.clearAllTimers();
                if (this.turns.length > 0) {
                    this.questionCount--
                    this.turn();

                    this.endTimeoutId = setTimeout(this.turnend.bind(this), 10 * 1000)
                    
                    //Call play recursively after 15 seconds
                    this.playTimeoutId = setTimeout(this.play.bind(this), 15 * 1000);

                } else {
                    //console.log("We've reached the end of the game");
                    this.clearAllTimers();
                    this.gameend();
                    //show the ending page and reset
                }
            };

            this.turn = function() {
                

                var turntriviaobj = this.turns[this.questionCount];
                var that = this;
                
                //console.log("the new turn has begun");
                $("#question").text(turntriviaobj.plot);
                
                for (var i=0; i < 4; i++) {
                    $("#answer" + [i + 1]).text(turntriviaobj.titleset[i]);
                }
            
                var timer = 1;

                $("#remainingTime").text("Time Remaining: " + timer + " Seconds");
                this.secondTimerId = setInterval(function () {
                    timer++;
                    $("#remainingTime").text("Time Remaining: " + timer + " Seconds");
                }, 1000);

                $(".answer").on("click", function() {
                    that.turnend($(this).text());
                    that.clearAllTimers();
                    //console.log("I saw the click");
                    that.clickTimeoutId = setTimeout(that.play.bind(that), 5 * 1000);
                })
            };

            this.turnend = function(clicktext) {
                //Need to clear the on click event handler to prevent multiple iterations of turnend running per click
                $(".answer").off();
                $(".answer").hide();
                this.clearAllTimers();

                this.playTimeoutId = setTimeout(this.play.bind(this), 5 * 1000);

                answer = this.turns[this.questionCount].title;
                
                if (clicktext === answer) {
                    $("#question").text("Correct!");
                    this.correctans++;
                 } else if (!clicktext) {
                     $("#question").text("You ran out of time!  The correct answer was " + answer + ".");
                     this.missedans++;
                } else {
                    $("#question").text("Sorry, the correct answer was " + answer + ".");
                    this.incorrectans++;
                }

                $("#media").show();
                $("#poster").attr("src", this.turns[this.questionCount].poster)
                this.turnEndCount++
                this.turns.pop();
            };

            this.gameend = function() {
                $(".answer").hide();
                $("#question").text("All done, here's how you did!");
                $("#result").html("<p>Correct Answers: " + this.correctans + "</p><p>Incorrect Answers: " + this.incorrectans + "</p><p>Unanswered: " + this.missedans + "</p>")
                $("#result").show();
                $("#start").text("Start Over?");
                $("#start").show();
            };

            this.startPlay = function() {

                var readyStatus = this.readyWait();
                console.log("readyStatus", readyStatus)
                
                if (readyStatus) {
                    this.clearAllTimers();
                    this.play();
                } 
            };

            this.clearAllTimers = function() {
                clearTimeout(this.clickTimeoutId);
                clearTimeout(this.playTimeoutId);
                clearTimeout(this.endTimeoutId);
                clearInterval(this.secondTimerId);
                clearInterval(this.gameInterval);
            };

            this.readyWait = function() {

                flag = true;

                

                for (var i=0; i < this.turns.length; i++) {
                    if (!this.turns[i].poster) {
                        console.log("I'm not ready yet");
                        flag = false;
                    };
                };
                return flag;
            };

            this.createTurns();
            this.gameInterval = setInterval(this.startPlay.bind(this), 1000);
        };

    $("#start").on("click", function() {
        newgame = new Game;
        $("#start").hide();
    });

});