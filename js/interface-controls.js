$(document).ready(function() {
    $(".btn.year").click(function(e){
        var target = $(e.target);
        target.toggleClass("primary");
        
        var years = [];
        $(".btn.year").each(function(i, e){
            var btn = $(e);
            if(btn.hasClass("primary")) 
                years.push(parseInt(btn.attr("year")));
        });
        
        showYears(years);
    });
});