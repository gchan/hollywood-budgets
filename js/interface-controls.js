function updateSliderMax(max){
    max = max ? Math.round((max/50 + 1)) * 50 : 0;
        
    $( "#slider-range" ).slider({
        max: max,
        values: [0, max],
    });
 
    $( "#amount" ).text( "Worldwide Gross: $" + 0 + "m - $" + max + "m" );
};
    
function filterIfSteady(min, max){
    if (min == $( "#slider-range" ).slider( "values", 0 ) && max == $( "#slider-range" ).slider( "values", 1 ))
        renderSelection();
};

function renderSelection(){
    var stories = [];
    $(".btn.story").each(function(i, e){
        var btn = $(e);
        if(btn.hasClass("btn-on"))
            stories.push(btn.text().toLowerCase());
    });
    
    var years = [];
    $(".btn.year").each(function(i, e){
        var btn = $(e);
        if(btn.hasClass("btn-primary"))
            years.push(parseInt(btn.text()));
    });
    
    var grossRange = [];
    grossRange.push($( "#slider-range" ).slider( "values", 0 ));
    grossRange.push($( "#slider-range" ).slider( "values", 1 ));
    
    showFiltered(years, stories, grossRange);
}

function addPopovers(stories){
    function content(desc, e1, e2){
        return desc + 
            "</br></br><ul>" + 
            "<li>" + e1 + "</li>" + 
            "<li>" + e2 + "</li>" + 
            "</ul>";
    }
    
    function formatTitle(title, colour){
        return "<div class='round-corners' style='background-color:#" + colour +"'></div>" +
            title;
    }

    $('.stories-buttons td').each(function(i, e){
        var btn = $(e);
        var title = btn.children("button").text();
        var story = stories[title];
        var colour = story.Colour;
        var description = story.Description;
        var example_one = story.ExampleOne;
        var example_two = story.ExampleTwo;
          
        btn.popover({
            placement: "bottom",
            delay: {
                show: 300,
                hide: 50
            },
            title: formatTitle(title, colour),
            content: content(description, example_one, example_two),
            animation: false,
            selector: false,
            trigger: 'hover'
        });
    });
    
    $('div.stories-legend table td').each(function(i, e){
        var td = $(e);
        var title = td.text();
        var story = stories[title];
        var colour = story.Colour;
        var description = story.Description;
        var example_one = story.ExampleOne;
        var example_two = story.ExampleTwo;
          
        td.popover({
            placement: "bottom",
            delay: {
                show: 300,
                hide: 50
            },
            title: formatTitle(title, colour),
            content: content(description, example_one, example_two),
            animation: false,
            selector: false,
            trigger: 'hover',
            placement: (i + 1) % 5 == 0 ? 'left' : 'right'
        });
    });
}
    
$(document).ready(function() {

    //disable text highlighting/selection on table
    $("div.stories-buttons, div.stories-legend").disableSelection();    
    
    $( "#slider-range" ).slider({
        animate: true,
        range: true,
        min: 0,
        step: 50,
        max: 2750,
        values: [0, 2750],
        slide: function( event, ui ) {
            $( "#amount" ).text( "Worldwide Gross: $" + ui.values[ 0 ] + "m - $" + ui.values[ 1 ] + "m");
            
            setTimeout("filterIfSteady(" + ui.values[ 0 ] + "," + ui.values[ 1 ] + ")" , 200);
        },
        stop: function(){
            renderSelection();
        }
    });
    
    $( "#amount" ).text( "Worldwide Gross: $" + 0 + "m - $" + $( "#slider-range" ).slider( "values", 1 ) + "m" );

    $('.btn.all-years').click(function(e){
        $('.btn.year').each(function(i, e){
                $(e).addClass("btn-primary");
            });
        renderSelection();
    });
    
    $('.btn.all-stories').click(function(e){
        $('.btn.story').each(function(i, e){
            $(e).addClass("btn-on");
        });
        renderSelection();
    });
    
    $('.btn.deselect-all').click(function(e){
        $('.btn.year').each(function(i, e){
            $(e).removeClass("btn-primary");
        });
        $('.btn.story').each(function(i, e){
            $(e).removeClass("btn-on");
        });
        removeAllFilms();
    });
    
    $(".btn.year").click(function(e){
        var target = $(e.target);
        target.toggleClass("btn-primary");

        renderSelection();
        if(!target.hasClass("btn-on"))
            hideAllTooltips();
    });
    
    $(".stories-buttons td").click(function(e){
        var target = $(e.target);
        if (!target.hasClass("btn"))
            target = target.children("button");
        target.toggleClass("btn-on");
        
        renderSelection();
        if(!target.hasClass("btn-on"))
            hideAllTooltips();
        else
            highlightStories(target.text());
    });
    
    $(".stories-buttons td").hover(
        function(e){
            var target = $(e.target);
            if (!target.hasClass("btn"))
                target = target.children("button");
            if(target.hasClass("btn-on"))
                setTimeout(delayedAction, 300);

            target[0].hover = 'in';
            
            function delayedAction(){
                if(target[0].hover == 'in')
                    highlightStories(target.text())
            }
        }, 
        function(e){
            var target = $(e.target);
            if (!target.hasClass("btn"))
                target = target.children("button");
            target[0].hover = 'out';

            unhighlight();
        }
    );
    
    $("div.stories-legend table td").hover(
        function(e){
            var td = $(e.target);
            setTimeout(delayedAction, 300);
            td[0].hover = 'in';
            
            function delayedAction(){
                if(td[0].hover == 'in')
                    highlightStories(td.text())
            }
        }, 
        function(e){
            var td = $(e.target);
            td[0].hover = 'out';

            unhighlight();
        }
    );
    
    $(".btn.year").hover(
        function(e){
            var btn = $(e.target);
            if(btn.hasClass("btn-primary"))
                setTimeout(delayedAction, 400);
            btn[0].hover = 'in'
                
            function delayedAction(){
                if(btn[0].hover == 'in')
                    highlightYear(parseInt(btn.text()));
            }
        }, 
        function(e){
            var btn = $(e.target);
            btn[0].hover = 'out'

            unhighlight();
        }
    );
});