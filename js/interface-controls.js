var updateSliderRange = function(min, max){
    min = min ? min : 0;
    max = max ? max : 0;
    
    $( "#slider-range" ).slider({
        min: Math.round(min),
        max: Math.round(max),
        values: [min, max],
    });       
    $( "#amount" ).text( "Worldwide Gross: $" + $( "#slider-range" ).slider( "values", 0 ) + "m - $" + $( "#slider-range" ).slider( "values", 1 ) + "m" );
};
    
$(document).ready(function() {
    $( "#slider-range" ).slider({
        range: true,
        min: 0,
        max: 1000,
        values: [0, 1000],
        slide: function( event, ui ) {
            $( "#amount" ).text( "Worldwide Gross: $" + ui.values[ 0 ] + "m - $" + ui.values[ 1 ] + "m");
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
                
        showFiltered(years, stories);
    }
    
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