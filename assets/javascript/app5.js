$(document).ready(function() {

        function Trivia (questionset) {

            this.answer = '';
            this.answerset = [];
            this.question = '';

            this.title;
            this.plot;
            this.poster;
            this.titleset = [];

            this.questionset = questionset;

            this.setAnswer = function() {
                
                this.answerset = this.randomize(this.questionset);  //randomize the questionset so we're choosing random answer choices
                this.answerset = this.answerset.slice(0, 4); //take the first 4 for answers
                this.answer = this.answerset[Math.floor(Math.random() * Math.floor(4))]; //pick one of the 4 to be the answer
                
                //remove the answer from the questionset, this will carry over to the Games object's set array
                var index = this.questionset.indexOf(this.answer);
                this.questionset.splice(index, 1);

                for (var i = 0; i < this.answerset.length; i++) {
                    this.apicall(this.answerset[i]);
                }
            };

            this.apicall = function (answerid) {    //calls omdb with the answerid which is the imdb id

                var queryURL = "https://www.omdbapi.com/?i=" + answerid + "&y=&plot=short&apikey=trilogy";
                var that = this;
                $.ajax({
                url: queryURL,
                method: "GET"
                }).done(function(response) {
                    //if this is the answer set title, plot, poster, and put the title into the titleset...
                    if (answerid === that.answer) {  
                        that.title = response.Title; 
                        that.plot = response.Plot;
                        that.poster = response.Poster;
                        that.titleset.push(response.Title);
                    //otherwise just put the title into title set for the answer buttons
                    } else {
                        that.titleset.push(response.Title);
                    }
                });
            };

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
            this.set = ["tt0088847", "tt0089886", "tt0088128", "tt0090305", "tt0091790", "tt0088763", "tt0096874", 
            "tt0080684", "tt0086190", "tt0084726", "tt0092007", "tt0083866", "tt0092890", "tt0091763",
            "tt0093779", "tt0082971", "tt0087469", "tt0097576", "tt0088247", "tt0096438", "tt0098635", 
            "tt0091369", "tt0089469", "tt0096928", "tt0092099", "tt0092099"];

            this.turns = [];

            this.questionCount = 10;

            this.correctans = 0;
            this.incorrectans = 0;
            this.missedans = 0;

            this.secondTimerId;
            this.endTimeoutId;
            this.playTimeoutId;
            this.clickTimeoutId;
            this.gameInterval;

            this.createTurns = function() { //creates an array with the entire game's worth of Trivia objects
                for (var i=0; i<10; i++) {
                    this.turns.push(new Trivia(this.set));
                };
                
            };

            this.play = function() {
                //set the page to ask the question and show answer buttons
                $("#start").hide();
                $(".answer").show();
                $("#result").hide();;
                $("#media").hide();
                $("#question").css("visibility", "visible");
                $("#remainingTime").css("visibility", "visible");

                this.clearAllTimers();

                //check to ensure that there are turns left - if there are take the turn...
                if (this.turns.length > 0) {
                    this.questionCount--
                    this.turn();

                    //after 20 seconds timeout to the result screen
                    this.endTimeoutId = setTimeout(this.turnend.bind(this), 20 * 1000)
                    
                    //recursively call play every 25 seconds
                    this.playTimeoutId = setTimeout(this.play.bind(this), 25 * 1000); 
                
                //otherwise end the game
                } else {
                    this.clearAllTimers();
                    this.gameend();
        
                }
            };

            this.turn = function() {
                

                var turntriviaobj = this.turns[this.questionCount]; //questionCount starts at the high end so the turn will be the last member of the array
                var that = this;
                
                //set the question div to the trivia objects plot
                $("#question").text(turntriviaobj.plot);
                
                //set the anwer buttons
                for (var i=0; i < 4; i++) {
                    $("#answer" + [i + 1]).text(turntriviaobj.titleset[i]);
                }
                //set time remaining to 20 immediately...
                var timer = 20;
                $("#remainingTime").text("Time Remaining: " + (timer) + " Seconds");
                //then rely on the interval to continue
                this.secondTimerId = setInterval(function () {
                    timer--;
                    $("#remainingTime").text("Time Remaining: " + (timer) + " Seconds");
                }, 1000);

                $(".answer").on("click", function() {
                    //when answer is clicked, run turnend, clear the timers, and set a 5 second countdown until the next turn starts
                    that.turnend($(this).text());
                    that.clearAllTimers(); //timers need to be cleared because we've superseded the wait for endTimeout or playTimeout
                    that.clickTimeoutId = setTimeout(that.play.bind(that), 5 * 1000); //doesn't this get cleared immediately in turn end??? somehow its necessary
                })
            };

            this.turnend = function(clicktext) {
                //since play is called recursively, we need to clear the click handler to prevent multiple iterations of turnend running per click
                $(".answer").off();
                $(".answer").hide();
                this.clearAllTimers(); //not sure this is required

                this.playTimeoutId = setTimeout(this.play.bind(this), 5 * 1000); //this doesn't work when called from the answer click... not sure why

                var answer = this.turns[this.questionCount].title;
                
                //if the clicktext is the answer (the title) then set the object properties and display the result
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
               
                //remove the last turn from the turns array
                this.turns.pop();
            };

            this.gameend = function() {
                //prepare and display the game over page
                $(".answer").hide();
                $("#question").text("All done, here's how you did!");
                $("#result").html("<p>Correct Answers: " + this.correctans + "</p><p>Incorrect Answers: " + this.incorrectans + "</p><p>Unanswered: " + this.missedans + "</p>")
                $("#result").show();
                $("#start").text("Start Over?");
                $("#start").show();
            };

            this.startPlay = function() {
                //run and check if the api calls have all progressed...
                var readyStatus = this.readyWait();
                
                //if so clear the gameInterval and call play
                if (readyStatus) {
                    $("#start").removeClass("loading");
                    $("#start").hide();
                    this.clearAllTimers();
                    this.play();
                } 
            };

            //utility function to clear all the timers... because its easier than tracking them
            this.clearAllTimers = function() {
                clearTimeout(this.clickTimeoutId);
                clearTimeout(this.playTimeoutId);
                clearTimeout(this.endTimeoutId);
                clearInterval(this.secondTimerId);
                clearInterval(this.gameInterval);
            };

            this.readyWait = function() {
            //checks to see if all turns in the turns array have responses by checking for the poster
            //if everything is ready the function exits as true which allows startPlay to call play()
                flag = true;

                for (var i=0; i < this.turns.length; i++) {
                    if (!this.turns[i].poster) {
                        //if there is no poster the response hasn't come in yet
                        //console.log("I'm not ready yet");
                        flag = false;
                    };
                };
                return flag;
            };

            //builds the turns array with every question/answer object
            this.createTurns();
            //try to start the game every second
            this.gameInterval = setInterval(this.startPlay.bind(this), 1000);
        };

    $("#start").on("click", function() { //start the game when either start or start over are clicked
        newgame = new Game;
        $("#start").addClass("loading");
        $("#start").text("");
    });

});