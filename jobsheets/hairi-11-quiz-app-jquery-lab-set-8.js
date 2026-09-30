$(document).ready(function(){

  var questions = [
    { q: "Which symbol is the jQuery shortcut?", o: ["#", "$", "@", "%"], a: 1 },
    { q: "Which method hides an element?", o: [".remove()", ".hide()", ".off()", ".stop()"], a: 1 },
    { q: "Which selector picks an element by id?", o: [".box", "box", "#box", "*box"], a: 2 },
    { q: "Which method reads the value of an input?", o: [".text()", ".html()", ".val()", ".attr()"], a: 2 },
    { q: "Which method adds a CSS class?", o: [".addClass()", ".css()", ".append()", ".class()"], a: 0 }
  ];
  var current = 0;
  var score = 0;
  var answered = false;

  function showQuestion(){
    var item = questions[current];
    answered = false;
    $("#qnum").text("Question " + (current + 1) + " of " + questions.length);
    $("#question").text(item.q);
    $("#options").empty();
    $.each(item.o, function(i, text){
      $("<li></li>").text(text).data("index", i).appendTo("#options");
    });
    $("#feedback").text("").removeClass("good bad");
    $("#nextBtn").prop("disabled", true).text(current === questions.length - 1 ? "Finish" : "Next");
    $("#progress").animate({ width: (current / questions.length * 100) + "%" }, 300);
    $("#quizBox").hide().fadeIn(300);
  }

  $("#options").on("click", "li", function(){
    if (answered) { return; }
    answered = true;
    var chosen = $(this).data("index");
    var right = questions[current].a;
    if (chosen === right) {
      score++;
      $(this).addClass("correct");
      $("#feedback").text("Correct!").addClass("good");
    } else {
      $(this).addClass("wrong");
      $("#options li").eq(right).addClass("correct");
      $("#feedback").text("Wrong answer.").addClass("bad");
    }
    $("#nextBtn").prop("disabled", false);
  });

  $("#nextBtn").click(function(){
    current++;
    if (current < questions.length) {
      showQuestion();
    } else {
      $("#progress").animate({ width: "100%" }, 300);
      $("#quizBox").fadeOut(200, function(){
        $("#finalScore").text(score + " / " + questions.length);
        $("#result").fadeIn();
      });
    }
  });

  $("#restartBtn").click(function(){
    current = 0;
    score = 0;
    $("#result").hide();
    $("#quizBox").show();
    showQuestion();
  });

  showQuestion();
});
