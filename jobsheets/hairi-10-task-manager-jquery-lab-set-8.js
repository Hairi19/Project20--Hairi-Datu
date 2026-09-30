$(document).ready(function(){

  function updateCounter(){
    var total = $("#taskList li").length;
    var left = $("#taskList li").not(".done").length;
    $("#counter").text(left + " of " + total + " tasks remaining");
  }

  function applyFilter(){
    var f = $(".filter.active").data("filter");
    $("#taskList li").each(function(){
      var isDone = $(this).hasClass("done");
      $(this).toggle(f === "all" || (f === "done" && isDone) || (f === "active" && !isDone));
    });
  }

  function addTask(){
    var text = $.trim($("#taskInput").val());
    if (text === "") {
      $("#message").text("Please type a task first.").fadeIn().delay(1500).fadeOut();
      return;
    }
    var item = $("<li></li>");
    item.append($("<span></span>").text(text));
    item.append('<button class="del">&times;</button>');
    $("#taskList").append(item);
    $("#taskInput").val("").focus();
    applyFilter();
    updateCounter();
  }

  $("#addBtn").click(addTask);

  $("#taskInput").keypress(function(e){
    if (e.which === 13) {
      addTask();
    }
  });

  $("#taskList").on("click", "span", function(){
    $(this).parent().toggleClass("done");
    applyFilter();
    updateCounter();
  });

  $("#taskList").on("click", ".del", function(){
    $(this).parent().fadeOut(200, function(){
      $(this).remove();
      updateCounter();
    });
  });

  $(".filter").click(function(){
    $(".filter").removeClass("active");
    $(this).addClass("active");
    applyFilter();
  });

  $("#clearDone").click(function(){
    $("#taskList li.done").remove();
    updateCounter();
  });

  updateCounter();
});
