function updateSliderRange(min, max){
    min = min ? Math.round(min) : 0;
    max = max ? Math.round(max) : 0;
    
    $( "#slider-range" ).slider({
        min: min,
        max: max,
        values: [min, max],
    });
 
    $( "#amount" ).text( "Worldwide Gross: $" + min + "m - $" + max + "m" );
};
    
function filterIfSteady(min, max){
    if (min == $( "#slider-range" ).slider( "values", 0 ) && max == $( "#slider-range" ).slider( "values", 1 ))
        renderSelection();
};

function renderSelection(){
    var stories = [];
    $(".btn.story").each(function(i, e){
        var btn = $(e);
        if(btn.hasClass("primary"))
            stories.push(btn.text().toLowerCase());
    });
    
    var years = [];
    $(".btn.year").each(function(i, e){
        var btn = $(e);
        if(btn.hasClass("primary"))
            years.push(parseInt(btn.text()));
    });
    
    var grossRange = [];
    grossRange.push($( "#slider-range" ).slider( "values", 0 ));
    grossRange.push($( "#slider-range" ).slider( "values", 1 ));
    
    showFiltered(years, stories, grossRange);
}
    
$(document).ready(function() {

    $( "#slider-range" ).slider({
        animate: true,
        range: true,
        min: 0,
        step: 50,
        max: 1000,
        values: [0, 1000],
        slide: function( event, ui ) {
            $( "#amount" ).text( "Worldwide Gross: $" + ui.values[ 0 ] + "m - $" + ui.values[ 1 ] + "m");
            
            setTimeout("filterIfSteady(" + ui.values[ 0 ] + "," + ui.values[ 1 ] + ")" , 200);
        },
        stop: function(){
            renderSelection();
        }
    });
                            
    $(".btn.year").click(function(e){
        var target = $(e.target);
        target.toggleClass("primary");

        renderSelection();
    });
    
    $(".btn.story").click(function(e){
        var target = $(e.target);
        target.toggleClass("primary");
        
        renderSelection();
    });
    
    $(".btn.story").hover(
        function(e){
            var btn = $(e.target);
            if(btn.hasClass("primary"))
                highlightStories(btn.text());
        }, 
        function(e){
            unhighlight();
        }
    );
    
    $(".btn.year").hover(
        function(e){
            var btn = $(e.target);
            if(btn.hasClass("primary"))
                highlightYear(parseInt(btn.text()));
        }, 
        function(e){
            unhighlight();
        }
    );
});