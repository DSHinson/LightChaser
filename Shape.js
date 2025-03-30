export class Shape {
  constructor(points, color = 'white') {
    this.points = points; // Array of vertices [ { x, y }, ... ]
    this.color = color; // Optional shape color
  }

 isPointInsideShape(point) {
    let inside = false; 
    // Initialize a boolean variable to track if the point is inside the shape.
    
    const points = this.points;
    // Extract the array of points (vertices) that define the shape.

    for (let i = 0, j = points.length - 1; i < points.length; j = i++) {
        // Iterate through the vertices of the shape.
        // 'i' is the current point index, 'j' is the previous point index (wrapping around for the last point).
        
        const xi = points[i].x, yi = points[i].y;
        const xj = points[j].x, yj = points[j].y;
        // Store the coordinates of the current point (xi, yi) and the previous point (xj, yj).

        const intersect = ((yi > point.y) !== (yj > point.y)) &&
            // Check if the vertical position of the point is between the y-coordinates of the edge being checked.
            // This determines whether the edge crosses the horizontal line at the point's y-coordinate.
            (point.x < (xj - xi) * (point.y - yi) / (yj - yi) + xi);
            // Calculate if the x-coordinate of the point is to the left of the edge being checked.
            // This uses the slope of the edge and the y-distance to find the intersection point on the x-axis.

        if (intersect) {
            inside = !inside;
            // If an intersection is found, toggle the 'inside' status.
            // This works because for a closed polygon, intersecting an odd number of edges means the point is inside.
        }
    }

    return inside;
    // Return the final status of whether the point is inside the shape.
}



  draw(ctx) {
    if (this.points.length < 2) return; // Need at least 2 points to draw

    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.moveTo(this.points[0].x, this.points[0].y);

    for (let i = 1; i < this.points.length; i++) {
      ctx.lineTo(this.points[i].x, this.points[i].y);
    }

    ctx.closePath();
    ctx.fill();
  }
}
