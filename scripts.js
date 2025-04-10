import { Shape } from './Shape.js';

const canvas = document.getElementById('raycastingCanvas');
const ctx = canvas.getContext('2d');
canvas.width = (window.innerWidth * 0.99);
canvas.height = ((window.innerHeight * 0.99) / 2);

const camCanvas = document.getElementById('cameraViewCanvas');
const camCtx = camCanvas.getContext('2d');
camCanvas.width = (window.innerWidth * 0.99);
camCanvas.height = ((window.innerHeight * 0.99) / 2);

let rotationSpeed = 5;
let cameraAngle = 0;
let fov = 90;
//Timer for frames
let lastTime = 0;
// Circle properties
let circle = {
  x: canvas.width / 2,
  y: canvas.height / 2,
  radius: 15,
  speed: 10,
  rays: []
};



const shapes = [
  // Triangle
  new Shape(
    [
      { x: 50, y: 50 },
      { x: 150, y: 50 },
      { x: 100, y: 150 }
    ],
    'red'
  ),
  // Rectangle
  new Shape(
    [
      { x: 300, y: 100 },
      { x: 400, y: 100 },
      { x: 400, y: 200 },
      { x: 300, y: 200 }
    ],
    'blue'
  ),
  // Pentagon
  new Shape(
    [
      { x: 500, y: 200 },
      { x: 600, y: 250 },
      { x: 550, y: 350 },
      { x: 450, y: 350 },
      { x: 400, y: 250 }
    ],
    'green'
  ),
  // Triangle
  new Shape(
    [
      { x: 200, y: 400 },
      { x: 300, y: 500 },
      { x: 100, y: 550 }
    ],
    'orange'
  ),
  // Hexagon
  new Shape(
    [
      { x: 600, y: 400 },
      { x: 700, y: 375 },
      { x: 800, y: 400 },
      { x: 800, y: 500 },
      { x: 700, y: 525 },
      { x: 600, y: 500 }
    ],
    'purple'
  ),
  // Rectangle
  new Shape(
    [
      { x: 100, y: 600 },
      { x: 250, y: 600 },
      { x: 250, y: 700 },
      { x: 100, y: 700 }
    ],
    'yellow'
  ),
  // Triangle
  new Shape(
    [
      { x: 700, y: 50 },
      { x: 800, y: 150 },
      { x: 650, y: 180 }
    ],
    'cyan'
  ),
  // Square
  new Shape(
    [
      { x: 600, y: 600 },
      { x: 700, y: 600 },
      { x: 700, y: 700 },
      { x: 600, y: 700 }
    ],
    'pink'
  ),
  // Triangle
  new Shape(
    [
      { x: 450, y: 600 },
      { x: 550, y: 700 },
      { x: 350, y: 750 }
    ],
    'teal'
  ),
  // Hexagon
  new Shape(
    [
      { x: 800, y: 700 },
      { x: 900, y: 650 },
      { x: 1000, y: 700 },
      { x: 1000, y: 800 },
      { x: 900, y: 850 },
      { x: 800, y: 800 }
    ],
    'olive'
  ),
  // Rectangle
  new Shape(
    [
      { x: 1100, y: 200 },
      { x: 1200, y: 200 },
      { x: 1200, y: 300 },
      { x: 1100, y: 300 }
    ],
    'gold'
  ),
  // Triangle
  new Shape(
    [
      { x: 200, y: 900 },
      { x: 300, y: 1000 },
      { x: 100, y: 1050 }
    ],
    'magenta'
  ),
  // Pentagon
  new Shape(
    [
      { x: 1200, y: 50 },
      { x: 1300, y: 25 },
      { x: 1400, y: 50 },
      { x: 1350, y: 150 },
      { x: 1250, y: 150 }
    ],
    'silver'
  )
];




// Key state: for tracking active keys
let keys = {};

// Event listeners for key presses
document.addEventListener('keydown', (e) => {
  console.log(e.key);
  keys[e.key] = true;
});

document.addEventListener('keyup', (e) => {
  keys[e.key] = false;
});

// Update circle position based on arrow key input
function updateCirclePosition() {
  // Predict the new position and check for collision before updating
  const newCircle = { ...circle }; // Copy current state
  if (keys['ArrowUp']) newCircle.y -= newCircle.speed;
  if (keys['ArrowDown']) newCircle.y += newCircle.speed;
  if (keys['ArrowLeft']) newCircle.x -= newCircle.speed;
  if (keys['ArrowRight']) newCircle.x += newCircle.speed;
  if (keys['q']) cameraAngle -= rotationSpeed;
  if (keys['e']) cameraAngle += rotationSpeed;

  cameraAngle = (cameraAngle + 360) % 360;

  newCircle.rays = calcRays(newCircle);
  const intersects = newCircle.rays.some((ray) => ray.rayLength === 1);
  if (intersects) {
    return;
  }

  // Prevent circle from moving out of bounds
  circle.x = Math.max(circle.radius, Math.min(canvas.width - newCircle.radius, newCircle.x));
  circle.y = Math.max(circle.radius, Math.min(canvas.height - newCircle.radius, newCircle.y));
  circle.rays = newCircle.rays;
}

// Draw the circle
function drawCircle() {
  updateCirclePosition();
  ctx.fillStyle = 'red'; // Set the circle's color
  ctx.beginPath();
  ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2);
  ctx.fill();

  // Draw the circle's rays
  circle.rays.forEach((ray) => {
    if (ray.rayInFov) {
      ctx.strokeStyle = 'rgba(255, 255, 0, 0.5)'; // Set yellow color with 50% opacity
    }
    else {
      ctx.strokeStyle = 'rgba(117, 117, 111, 0.5)';
    }


    ctx.lineWidth = 1; // Adjust line width if necessary
    ctx.beginPath();
    ctx.moveTo(ray.startPoint.x, ray.startPoint.y); // Start at the ray's start point
    ctx.lineTo(ray.endPoint.x, ray.endPoint.y); // Draw line to the ray's endpoint
    ctx.stroke(); // Render the line
  });

}


function calcRays(calcCircle) {
  const points = generateCirclePoints(calcCircle); // Points on the circle's edge
  const rays = points.map((point) => {
    // calculate the ray direction by comparing the co-ordinates of the circle center to the point co-ordinates
    //1. Raw direction 
    const dx = point.x - calcCircle.x;
    const dy = point.y - calcCircle.y;

    //2. Calculate the magnitude
    const magnitude = Math.sqrt(dx * dx + dy * dy);

    //3. Normalize the direction vector
    const direction = {
      dx: dx / magnitude,
      dy: dy / magnitude
    }
    const startPoint = { ...point };
    // 4. Define ray length (based on canvas or collision detection logic)
    let AndIntersectColour = calculateRayLengthAndIntersectColour(direction, point);
    let rayLength = AndIntersectColour.rayLength;
    let intersectColour = AndIntersectColour.intersectColour;
    let rayInFov = false

    //check if current degree is in fov
    let fovHalf = fov / 2;
    let diff = Math.abs(point.degree - cameraAngle);
    diff = diff > 180 ? 360 - diff : diff;
    if (diff <= fovHalf) {
      rayInFov = true;
    }

    // 5. Calculate endPoint using ray length
    const endPoint = {
      x: startPoint.x + direction.dx * rayLength,
      y: startPoint.y + direction.dy * rayLength
    };

    return {
      startPoint: startPoint,
      direction,
      endPoint: endPoint,
      rayLength,
      degree: point.degree,
      rayInFov,
      intersectColour
    }

  })
  return rays
}

function calculateRayLengthAndIntersectColour(direction, currentPoint) {
  const segmentLength = 1; // Length of each segment
  let rayLength = 0; // Initialize ray length
  let intersectColour = 'black';

  while (true) {
    // Move currentPoint outward by segmentLength
    currentPoint.x += direction.dx * segmentLength;
    currentPoint.y += direction.dy * segmentLength;
    rayLength += segmentLength;

    // Check if currentPoint is outside the canvas bounds
    if ( currentPoint.x < 0 || currentPoint.x > canvas.width || currentPoint.y < 0 || currentPoint.y > canvas.height) {
      break; // Stop if the ray exits the canvas
    }

    // Check if currentPoint intersects any shape
    for (let shape of shapes) {
      if (shape.isPointInsideShape(currentPoint)) {
        intersectColour = shape.color;
        return {rayLength , intersectColour};// Stop and return length if intersection occurs
      }
    }
  }

  return {rayLength , intersectColour}; // Return the full ray length if no intersections
}


function generateCirclePoints(circle) {
  const points = [];
  for (let degree = 0; degree < 360; degree++) {
    const radian = (degree * Math.PI) / 180;
    const x = circle.x + circle.radius * Math.cos(radian);
    const y = circle.y + circle.radius * Math.sin(radian);
    points.push({ x, y, degree });
  }
  return points;
}

function renderCameraViewFPV() {
  camCtx.clearRect(0, 0, camCanvas.width, camCanvas.height);
  camCtx.fillStyle = 'black';
  camCtx.fillRect(0, 0, camCanvas.width, camCanvas.height);

  const fovDegrees = 90;
  const halfFov = fovDegrees / 2;

  const fovRays = circle.rays
    .map(ray => {
      let angleDiff = ray.degree - cameraAngle;
      if (angleDiff > 180) angleDiff -= 360;
      if (angleDiff < -180) angleDiff += 360;
      return { ray, angleDiff };
    })
    .filter(obj => Math.abs(obj.angleDiff) <= halfFov)
    .sort((a, b) => a.angleDiff - b.angleDiff); // sort left to right

  const numRays = fovRays.length;
  if (numRays === 0) return;

  const screenWidth = camCanvas.width;
  const screenHeight = camCanvas.height;
  const columnWidth = screenWidth / numRays;

  for (let i = 0; i < numRays; i++) {
    const { ray, angleDiff } = fovRays[i];

    const dx = ray.endPoint.x - ray.startPoint.x;
    const dy = ray.endPoint.y - ray.startPoint.y;
    let distance = Math.sqrt(dx * dx + dy * dy);
    distance = Math.max(1, distance);

    // Fix fisheye distortion
    distance *= Math.cos(angleDiff * (Math.PI / 180));

    // Wall height simulation
    const wallHeight = Math.min(screenHeight, 3000 / distance);

    camCtx.fillStyle = ray.intersectColour;
    camCtx.fillRect(i * columnWidth, (screenHeight - wallHeight) / 2, columnWidth, wallHeight);
  }
}




function drawScene(currentTime) {
  const deltaTime = currentTime - lastTime;

  if (deltaTime >= 1000 / 30) { // Roughly 33.3ms
    lastTime = currentTime;

    // Clear and redraw your canvas
    ctx.fillStyle = 'black';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    drawCircle();
    renderCameraViewFPV();
    //draw shapes
    shapes.forEach(shape => {
      shape.draw(ctx);
    });

  }

  requestAnimationFrame(drawScene); // Maintain the game loop
}

requestAnimationFrame(drawScene);
