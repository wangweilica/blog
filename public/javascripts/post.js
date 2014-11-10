$(function() {
    $("#publish").off("click").on("click",function(){
        $("[name='post']").val($("#myEditor").html());
        $("#myForm").submit();
    })
});