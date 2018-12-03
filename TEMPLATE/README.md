# CS171-final-project
CS171 Final Project - A Hungry Student's Guide to Cambridge

Jamie Chen, Jake Cui, and Annie Kim

Our final project is a website that we made using data from the Yelp dataset available here: https://www.yelp.com/dataset/documentation/main.
We have implemented a recommender tool using svgs, a map based on Leaflet, and a treemap. The recommendation is generated
in the main.js file, the map is implemented in restaurantMap.js, and the treemap is implemented in treemap.js.

The recommender tool generates suggested restaurants based on user input of price, star rating, and cuisne. The restaurant map shows icons corresponding to individual
restaurants in the Las Vegas area and was implemented based on lab 10's Leaflet map. The icons are colored from red to green to correspond
to star rating, and clicking on an icon will show more information on the restaurant (provided by the Yelp dataset). You can filter the map
based on star rating as well as price, and you can also use the categories in the treemap to filter the restaurant map. Clicking on a category
in the treemap will filter the restaurants shown on the map such that only restaurants that match that cuisine will show up.

LV_data.json contains data that we filtered from the original Yelp business.json file (filtered with the file clean_data.py), which contains data on various restaurants
around the world. Our dataset contains only restaurants from Las Vegas.

Our files:

/css

    /style.css

/images

/js

    /main.js
    /treemap.js
    /restaurantMap.js

index.html

Library files:

/css

    /bootstrap.min.css
    /leaflet.awesome-markers.css
    /leaflet.css

/js

    /bootstrap.min.js
    /d3.min.js
    /d3-color.js
    /d3-interpolate.js
    /d3-scale-chromatic.js
    /jquery.min.js
    /leaflet.awesome-markers.js
    /leaflet.js
    /leaflet-src.esm.js
    /leaflet-src.js
    /popper.min.js
    /smooth-scroll.js

