import React, { useEffect } from "react";
import convexHull from "./math/convexHull";
import dummyDownsampling from "./math/dummyDownsampling";
import { drawPoints, drawMouse, drawPolygon, clearCanvas } from "./canvas/draw";

const ImageAnnotation = () => {
  let canvas;
  let ctx;
  let mouseX;
  let mouseY;
  let mouseDown = false;
  let lastX;
  let lastY;
  let points = [];

  const onMouseDown = () => {
    clearCanvas(ctx, canvas);
    mouseDown = true;
    const lastCoord = drawMouse(ctx, points, lastX, lastY, mouseX, mouseY, 2);
    [lastX, lastY] = lastCoord;
  };

  const onMouseUp = () => {
    mouseDown = false;
    lastX = 0;
    lastY = 0;

    const aHull = convexHull(ctx, points, points.length);
    dummyDownsampling(aHull);
    clearCanvas(ctx, canvas);
    drawPolygon(ctx, aHull);
    drawPoints(ctx, aHull);
    points = [];
  };

  const getMousePos = (e) => {
    mouseX = e.offsetX;
    mouseY = e.offsetY;
  };

  const onMouseMove = (e) => {
    getMousePos(e);
    if (mouseDown) {
      const lastCoord = drawMouse(ctx, points, lastX, lastY, mouseX, mouseY, 2);
      [lastX, lastY] = lastCoord;
    }
  };

  useEffect(() => {
    canvas = document.getElementById("sketchpad");
    ctx = canvas.getContext("2d");
    canvas.addEventListener("mousedown", onMouseDown, false);
    canvas.addEventListener("mousemove", onMouseMove, false);
    window.addEventListener("mouseup", onMouseUp, false);
  }, []); // componentDidMount behaviour

  return <canvas id="sketchpad" width="600" height="300" />;
};

export default ImageAnnotation;
