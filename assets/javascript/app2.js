$(document).ready(function() {

    var movieTitles = {
        
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

    var triviaSet = [];
    var countdownid;
    var questioncount = 10;
    var intervalId;
    var winCount = 0;
    var lossCount = 0;
    var unansweredCount = 0;

    randomize = function(arr) {
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

    printTriviaPage = function(question, answers) {

        //ids to hide
        $("#start", "result").hide();

        //id's to show
        $("#remainingTime", "#question").css("visibility", "visible");
        $("#question", "#answer").show();
        $("#question").text(question)
        fridgeMagnet.text($(this).attr("data-letter"));

        for (i=0; i < answers.length; i++) {
            var answertext = "#answer" + (i + 1);
            $("#answer" + (i + 1)).html(answers[i]);
            
        }
    };

    printAnswerPage = function(ans, flag, c, i) {
        if (flag === false) {
            unansweredCount++;
            $("#result").html("Outta time!!! " + answer + " is the correct answer!!!");
        }
        $("#result").show();
        $("#question").hide();
        $(".answer").hide();
    };

    setTriviaSet = function() {
        triviaSet = randomize(Object.keys(movieTitles)).slice(0, 10);
    };

    getTriviaSet = function() {
        return randomize(Object.keys(movieTitles)).slice(0, 10);
    };

    getAnswer = function() {
        return triviaSet.pop();
    };

    getAnswerSet = function(answer) {
        var arr = randomize(Object.keys(movieTitles)).slice(0, 3)
        arr.push(answer);
        return randomize(arr);
    };

    setAnswers = function() {
        var index = that.fullSet.indexOf(movie);

        if (index > -1) {
            that.fullSet.splice(index, 1);
            var temparr = that.fullSet.slice(0, 3);
            temparr.push(movie)
            return that.randomize(temparr);
        }
    };

    playTrivia = function() {

        if (questioncount = 0) {
            clearInterval(intervalId);
        }
        questioncount--;
        var answer = getAnswer();
        var question = movieTitles[answer];
        var answerset = getAnswerSet(answer);
        var timer = 30;
        
        printTriviaPage(question, answerset);

        setTimeout(printAnswerPage, 30000);

        $(".answer").on("click", function() {
            var answerflag = true;
            var correct = false;
            var incorrect = false;
        
            clearInterval(intervalId);
      
            if ($(this).text() === answer) {
                window.wincount++;
                correct = true;
                $("#result").html("That's right" + answer + " is the correct answer!!!");
            } else {
                window.losscount++;
                incorrect = true;
                $("#result").html("Sorry - that's incorrect, " + answer + " is the correct answer!!!");
            }

            printAnswerPage(answer, answerflag, correct, incorrect);
            answerflag = false;
   

            setTimeout(playGame, 3000);

        });

        //countdownid = (setInterval(displayCountDown), 1000);
        console.log(answer, question, answerset);
    };

    // clickedAnswer = function() {
    //     var answerflag = true;
    //     var correct = false;
    //     var incorrect = false;
    
    //     clearInterval(intervalId);
  
    //     if ($(this).text() === answer) {
    //         wincount++;
    //         correct = true;
    //         $("#question").html("That's right" + answer + " is the correct answer!!!");
    //     } else {
    //         losscount++;
    //         incorrect = true;
    //         $("#question").html("Sorry - that's incorrect, " + answer + " is the correct answer!!!");
    //     }

    //     printAnswerPage(answer, answerflag, correct, incorrect);
    //     answerflag = false;
    //     printAnswerPage();
    //     clearInterval(intervalId);
    //     setTimeout(playGame, 3000);
        
    // }

    displayCountDown = function() {
        $("#remainingTime").html("You have " + timer-- + " seconds to select the answer!!!")
    }

    countdownStart = function () {
        countdownid = (setInterval(function() {$("#remainingTime").html("You have " + timer-- + " seconds to select the answer!!!")}, 1000));
    };

    countdownStop = function () {
        clearInterval(countdownid);
    };

    playGame = function() {
        playTrivia();
        intervalId = setInterval(playTrivia, 33000);
    };

    start = function() {
        setTriviaSet();
        playTrivia();
    };

    $("#start").on("click", start); // {
    
       // setTriviaSet() ;
       // playTriva();
        //console.log(triviaSet);

        //var answerSet = getAnswerSet();
        //var question = getQuestion();

        //printQuestion();
    

    $(".answer").on("click", function(event) {
        console.log($(this).text());

    });

    console.log(triviaSet);
    //playTrivia();
    //playGame();
});
    