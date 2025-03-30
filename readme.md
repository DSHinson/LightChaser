# Raycasting and Shape Collision Visualization

## Description
This project demonstrates raycasting and shape collision detection, visualizing how rays interact with randomly distributed shapes. Rays emanate from the edge of a circle and dynamically stop when they intersect a shape or reach the canvas boundary.

## Features
- Draws rays from a circle to intersect shapes.
- Detects and visualizes ray intersections with shapes.
- Rays are semi-transparent for enhanced visuals.

## Inspiration
This project was inspired by the concepts discussed in [The Coding Train's video on raycasting](https://www.youtube.com/watch?v=TOEi6T2mtHo). The video explores raycasting mechanics and visualizations, forming the basis for this project's logic and approach.

## How It Works
1. Rays are drawn from the perimeter of a circle outward in defined directions.
2. Each ray stops dynamically when it intersects a shape or reaches the canvas edge.
3. Shapes are predefined and distributed evenly across the canvas.
4. The canvas updates dynamically to reflect raycasting and intersection mechanics.

## Technologies Used
- HTML Canvas for rendering shapes and rays.
- JavaScript for collision detection and raycasting logic.

## Getting Started
To run this project:
1. Clone the repository
2. Open the project folder in VSCode.
3. Install the "Live Server" extension in VSCode if you haven't already.
4. Right-click on the `index.html` file in the VSCode Explorer and select "Open with Live Server".
5. Your default browser will open with the project running on a local development server.
6. Enjoy watching the rays interact with the shapes on the canvas!

**Note**: Opening the `index.html` file directly in the browser may result in a CORS error because browsers block certain file access when not served through a local or web server.


## Credits
Inspired by [The Coding Train's raycasting video](https://www.youtube.com/watch?v=TOEi6T2mtHo). A huge thanks to the channel for breaking down complex topics into easy-to-understand visuals.