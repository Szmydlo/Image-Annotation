// functions to draw inside canvas

// draw points are small rectangles
const drawPoints = (ctx, aPoints) => {
  ctx.fillStyle = "#000000";

  for (let i = 0; i < aPoints.length; i += 1) {
    ctx.fillRect(aPoints[i].x, aPoints[i].y, 3, 3);
  }
};

// function which draws continuous line base on mouse movement and adds points to array
const drawMouse = (context, points, lastX, lastY, x, y, size) => {
  context.fillStyle = "#000000";
  context.strokeStyle = "#000000";
  if (lastX && lastY && (x !== lastX || y !== lastY)) {
    context.lineWidth = 2 * size;
    context.beginPath();
    context.moveTo(lastX, lastY);
    context.lineTo(x, y);
    context.stroke();
  }
  context.beginPath();
  context.arc(x, y, size, 0, Math.PI * 2, true);
  context.closePath();
  context.fill();
  if (
    !points.length ||
    points[points.length - 1].x !== x ||
    points[points.length - 1].y !== y
  ) {
    points.push({ x, y });
  }
  return [x, y];
};

// function used to draw polygon out of chosen points
const drawPolygon = (context, aPoints) => {
  context.beginPath();
  context.moveTo(aPoints[0].x, aPoints[0].y);
  for (let i = 0; i < aPoints.length; i += 1) {
    context.lineTo(aPoints[i].x, aPoints[i].y);
  }
  context.strokeStyle = "red";
  context.closePath();
  context.stroke();
};

const clearCanvas = (context, canvas) => {
  context.clearRect(0, 0, canvas.width, canvas.height);
};

module.exports = { drawPoints, drawMouse, drawPolygon, clearCanvas };
