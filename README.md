Hollywood Budgets
==================

What is it?
------------------
[Hollywood Budgets](http://hollywood-budgets.devgordon.com/) is web-based data visualization of Hollywood films. This [D3.js](http://d3js.org/) project was created as an entry for the [Information is Beautiful Awards](http://www.informationisbeautifulawards.com/2012/01/challenge-of-the-stars/) and was subsequently [shortlisted](http://www.informationisbeautifulawards.com/2012/02/hollywood-dataviz-challenge-interactive-shortlist/). This data visualization can also be found on [Visual.ly](http://visual.ly/hollywood-budgets).

The Visualization
-----------------
Each film is represented as a bubble on the chart. The bubble's position is determined by its [Rotten Tomatoes](https://www.rottentomatoes.com/) score and its profitability percentage (gross over budget). The size of the bubble represents the worldwide gross. Films are color coded and categorized into 22 story types.

Hollywood films can be filtered by year, story, and worldwide gross using the user interface on the right. Hovering your cursor a bubble will display more detailed information about the film. Hovering over a story will display a description of the story type. 

Users can use their mouse wheel to zoom into the graph to get a better picture of where films stand against its neighbours. Once zoomed in, users can click and pan around the graph.

Background
-----------------------------------
This project was started as an exercise to practice building data visualizations using D3.js and other common web libraries. The visualization was initially built without any web framework. The web page and assets were simply served up by a server. Recently I decided to migrate the project to Ruby on Rails as another exercise. This allowed better management of dependencies via gems and allowed Rails to serve the various libraries and files through the sprockets asset pipeline.

Data Source
-----------------
Data was provided by The [Information is Beautiful Awards](http://www.informationisbeautifulawards.com/2012/01/challenge-of-the-stars/) in the form of a [spreadsheet](http://bit.ly/hollywoodbudgets). The data was processed and cleaned up using various tools including [Google Refine/OpenRefine](https://github.com/OpenRefine/OpenRefine). The raw data through various stages of transformation can be found in the [/public/data/](https://github.com/gchan/hollywood-budgets/tree/master/public/data) directory of this project.

Libraries & Dependencies
------------------------
* [D3.js](http://d3js.org/)
* [jQuery](http://jquery.com/)
* [jQuery UI](http://jqueryui.com/)
* [Twitter Bootstrap](http://twitter.github.com/bootstrap)
* [jQuery UI Bootstrap](http://addyosmani.github.com/jquery-ui-bootstrap/)
* [Ruby on Rails](http://rubyonrails.org/)
* [Sass](http://sass-lang.com)

Potential Improvements
-----------------------------
* The visualization could be extended by implementing more filtering options. 
* The user interface could allow users to switch the variables on the graph axes to view the films from a different perspective. 
* A search feature could be implemented.
* The data could be viewed in a tabular form with sorting options.
* When panning around the graph, bubbles disappear too early and reappear too late. Some simple geometry and mathematics can resolve this issue.
* Some transitions (fade in/out) of bubbles could be improved. Smooth transitions are non-existent in some cases due to performance issues.
* The cleaned [data](https://github.com/gchan/hollywood-budgets/blob/master/public/data/films_all_full.json) can be used to visualize the information in a completely different way.


Credits
---------------------
This nifty data viz was created by [Gordon Chan](twitter.com/devgordon).
Feel free to fork and contribute. :)

Hollywood Budgets is free software distributed under the new BSD License.