$(document).ready(function () {
    var loc = window.location.href;
    loc = loc.substring(loc.indexOf("3000/") + 4);
    $("ul li").each(function (index, value) {
        var target = $(this).children().attr("href");
        if (loc == target) {
            $("ul li").attr("class", "");
            $(this).attr("class", "active");
        }
    });
});