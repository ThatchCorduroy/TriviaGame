document.addEventListener("DOMContentLoaded", function(event) { 

    var correctcount = 0
    var incorrectcount = 0
    var unanswered = 0

    
    function Trivia (movie, answers) {
        
        correct= "";
        this.title = "cheese";
        this.plot = "";
        this.turnmovie = movie;
        this.turnanswers = answers;

        this.getTitle=function() {
            return this.title;
        };
        
        getAnswers= function() {
            return this.answers;
        };

        getCorrect= function() {
            return correct;
        };

        getQuestion= function() {
            return question;
        };
        
        setAnswers= function(arr, correctindex) {
            answers = arr;
            correct = arr[correctindex];
        };

        this.printQuestion= function() {

            var queryURL = "https://www.omdbapi.com/?i=" + this.turnmovie + "&y=&plot=short&apikey=trilogy";
            var that = this;
            $.ajax({
              url: queryURL,
              method: "GET"
            }).done(function(response) {  
                that.title = response.Title; 
                console.log("Just Set Title"); 
                $("#question").html(response.Plot);
                $("#question").val("turnmovie");
            });
        };

        this.printAnswers= function(answers) {
            
            var answertitles = []

            console.log(this)
            
            this.turnanswers.forEach(function(movie) {
                var queryURL = "https://www.omdbapi.com/?i=" + movie + "&y=&plot=short&apikey=trilogy";
                $.ajax({
                  url: queryURL,
                  method: "GET"
                }).done(function(response) {

                    answertitles.push(response.Title);

                    console.log(answertitles);

                    $("#answer" + answertitles.length).html(response.Title);
                });

            });
        };

        this.printPoster= function() {
            
            var queryURL = "https://www.omdbapi.com/?i=" + this.turnmovie + "&y=&plot=short&apikey=trilogy";
            
            $.ajax({
              url: queryURL,
              method: "GET"
            }).done(function(response) {    
                var image = document.getElementById("poster");
                image.src = response.Poster;
            });
        };

    };

    

    var gamePlay = {

        fullSet: ["tt0088847", "tt0089886", "tt0088128", "tt0090305", "tt0091790", "tt0088763", "tt0096874", 
        "tt0080684", "tt0086190", "tt0084726", "tt0092007", "tt0083866", "tt0092890", "tt0091763",
        "tt0093779", "tt0082971", "tt0087469", "tt0097576", "tt0088247", "tt0096438", "tt0098635", 
        "tt0091369", "tt0089469", "tt0096928", "tt0092099"],

        subSet: [],

        init: function() {
            this.subSet = this.randomize(this.fullSet).slice(0,10);

            //Hide the start button
            document.getElementById("start").style.display = 'none';
            this.newTurn();

            // questionCount = 10;

            // outterid = setInterval(function() {
            //     questionCount--
            //     if (questionCount === 0);
            //         clearInterval(outterid);

            //     this.newTurn();
            //     this.displayQuestion();
            //     that = this;

            //     var seconds = 30;
            //     innerid = setInterval(function () {
            //         seconds--;
            //         if (seconds === 0) {
            //             clearInterval(innerid);
            //             this.displayAnswer();
            //         }
            //     }.bind(this), 1000);
                
            //     $(".answer").on("click", function() {
            //         that.countdown.timerStop();
            //         that.displayAnswer();
            //         setTimeout(function() {
            //             that.newTurn();
            //             that.displayQuestion();
            //             that.countdown.timerStart()
            //         }, 3000);

            //         console.log("I SAW THAT CLICK");
            //     });

            // }.bind(this), 5000);
          
        },

        displayQuestion: function () {
            document.getElementById("status").style.display = 'none';
            document.getElementById("media").style.display = 'none';

            document.getElementById("remainingTime").style.visibility = 'visible';
            document.getElementById("question").style.visibility = 'visible';
            document.getElementById("question").style.display = 'block';
            document.getElementById("answer1").style.display = 'block';
            document.getElementById("answer2").style.display = 'block';
            document.getElementById("answer3").style.display = 'block';
            document.getElementById("answer4").style.display = 'block';
        },

        displayAnswer: function () {
            console.log("I SHOULD BE HERE");
            document.getElementById("remainingTime").style.visibility = 'visible';
            document.getElementById("question").style.display = 'none';
            document.getElementById("answer1").style.display = 'none';
            document.getElementById("answer2").style.display = 'none';
            document.getElementById("answer3").style.display = 'none';
            document.getElementById("answer4").style.display = 'none';
            
            document.getElementById("status").style.display = 'block';
            document.getElementById("media").style.display = 'block';
        },

        displayGameOver: function () {
            document.getElementById("remainingTime").style.visibility = 'visible';
            document.getElementById("question").style.display = 'none';
            document.getElementById("answer1").style.display = 'none';
            document.getElementById("answer2").style.display = 'none';
            document.getElementById("answer3").style.display = 'none';
            document.getElementById("answer4").style.display = 'none';

            document.getElementById("gameOver").style.display = 'block';

        },

        randomize: function(arr) {
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
        },

        countdown: {
            
            timer: 30,
            id: 0,
            
            timerStart: function() {
                id = setInterval(function() {$("#remainingTime").html("You have " + this.timer-- + " seconds to select the answer!!!")}.bind(this), 1000);
                //id = setInterval(function () {document.getElementById("remainingTime").innerHTML = this.timer++}.bind(this), 1000);  //ew
            },
    
            timerStop: function() {
                this.timer = 30;
                clearInterval(id);
            },
        },

        newTurn: function() {
            //This is a nightmare

            //Set the environment
            
            var movie = this.subSet.pop();
            var that = this;
            
            var answers = (function() {
                var index = that.fullSet.indexOf(movie);

                if (index > -1) {
                    that.fullSet.splice(index, 1);
                    var temparr = that.fullSet.slice(0, 3);
                    temparr.push(movie)
                    return that.randomize(temparr);
                }
            }());

            var clickAnswer = (function() {
                console.log("Click works");
                that.countdown.timerStop();
                console.log("turn", turn);
                if ($(this).text() === turn.getTitle()) {
                    console.log("WAIT - I'M HERE I'm HREE"); 
                    $("#status").text(turn.getTitle() + " is the correct answer!!!");
                    //document.getElementById("status").text = turn.getTitle() + " is the correct answer!!!"
                    correctcount++;
                }
                else {
                    $("#status").text("Sorry, that's incorrect.  The correct answer was " + turn.getTitle() + ".");
                    incorrectcount++;
                };
                that.displayAnswer();
                setTimeout(function() {
                    that.newTurn();
                    that.displayQuestion();
                    that.countdown.timerStart()
                }, 3000);
            });

            turn = new Trivia(movie, answers);
            
            turn.printQuestion()
            console.log("Turn Down here", turn.getTitle());
            turn.printAnswers();
            this.countdown.timerStart();
            turn.printPoster();
            var movie = this.subSet.pop();

            this.displayQuestion();
            
            $(".answer").on("click", clickAnswer);
            //$(".answer").on("click", this.clickAnswer());
            

            //
            // outterid = setInterval(function() {
            //     questionCount--
            //     if (questionCount === 0);
            //         clearInterval(outterid);

            //     this.newTurn();
            //     this.displayQuestion();
            //     that = this;

            //     var seconds = 30;
            //     innerid = setInterval(function () {
            //         seconds--;
            //         if (seconds === 0) {
            //             clearInterval(innerid);
            //             this.displayAnswer();
            //         }
            //     }.bind(this), 1000);
                
            //     $(".answer").on("click", function() {
            //         that.countdown.timerStop();
            //         that.displayAnswer();
            //         setTimeout(function() {
            //             that.newTurn();
            //             that.displayQuestion();
            //             that.countdown.timerStart()
            //         }, 3000);

            //         console.log("I SAW THAT CLICK");
            //     });

            // }.bind(this), 5000);
           


        },

        // newTurn: function() {
        //     //This is a nightmare


        //     var movie = this.subSet.pop();
        //     var that = this;
            
        //     var answers = (function() {
        //         var index = that.fullSet.indexOf(movie);

        //         if (index > -1) {
        //             that.fullSet.splice(index, 1);
        //             var temparr = that.fullSet.slice(0, 3);
        //             temparr.push(movie)
        //             return that.randomize(temparr);
        //         }
        //     }());
        
        //     turn = new Trivia(movie, answers);
        //     turn.printQuestion()
        //     turn.printAnswers();
        //     this.countdown.timerStart();
        //     //turn.printPoster();
        //     var movie = this.subSet.pop();
        // },
        
        setStartScreen: function() {
            document.getElementsByClassName("answer").style.display = 'block';
        },

        setQuestionScreen: function() {

        },

        setValidationScreen: function() {

        },

        setGameOverScreen: function() {

        },
        //turnAns: Trivia.getAnswers(),
        
        // turn: new Triva;

        // turn.getQuestion()




        hover: function() {
            document.onkeyup = function(event) {
                userText.textContent = event.key;
              };
        }


    }
    document.getElementById("start").addEventListener("click", function(event) {
        gamePlay.init();
        //gamePlay.countdown.timerStart();
        //gamePlay.newTurn();
    });



    // document.getElementById("start").onclick = function(event) {
    //     console.log(event);
    //     //console.log(event.target.id);
    //     };
    
    
    // gamePlay.init();
    // gamePlay.countdown.timerStart();
    // gamePlay.newTurn();
});
