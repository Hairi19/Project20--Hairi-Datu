$(document).ready(function(){
  $("button").click(function(){
    $.ajax({
      url: "product.txt",
      success: function(result){
        $("#div1").html(result);
      }
    });
  });
});
