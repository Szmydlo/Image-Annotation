# Image Annotation

Advanced internship by Quality Match

## Milestones:
1. Draw line based on cursor move :white_check_mark:
2. Create polygon out of it :white_check_mark:
3. Add dragging functionality :white_check_mark:
4. Up-/Downsampling of the number of vertices :white_check_mark:

## Current state:
Apps follows mouse stroke and draws polygon based on mouse movement with vertices marked.
User chooses if the polygon should be convex or concave.
Polygon is then calculated with wished number of vertices.
Created polygon can be moved (dragged) or adjusted (by dragging one of the vertices)
User can adjust number of vertices using +/- buttons

## How to run:
Easiest: open [Heroku](https://image-annotation-szydlik.herokuapp.com/)  
OR:  
1. Clone the repository
2. Open terminal in repository's main folder
3. Run ```npm install```
4. Run ```npm start```. The App will open in browser under: [localhost:3000](http://localhost:3000)