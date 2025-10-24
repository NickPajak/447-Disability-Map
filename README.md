
 
repo structure updated 10/07  

SOME REFERENCE: https://tomickigrzegorz.github.io/react-leaflet-examples/#/coordinates-after-clicking-on-the-map

https://ucdavisdatalab.github.io/workshop_web_maps/add-a-popup.html

dependencies:  
will need to install npm for this to work.  
after you clone this repo, running 'npm install' should build the environment to use react app  



public/ -- static assets like favicon, index.html   
  
src/  
    assets/ -- logos, icons, images (not map data)  
    components/ -- reusable UI elements (buttons, modals, etc.)  
    pages/ -- page-level views (Home, MapView, Feedback)  
    map/ -- Leaflet/Mazemap logic & configuration  
        layers/ -- functions that will load GeoJSON or map layers  
        indoor/ -- indoor navigation, routing, and floor handling  
        geojson/ geojson map data  
    context/ -- react content for global states  
    utils/ -- helper functions  
    styles/ -- CSS or Tailwind config  
