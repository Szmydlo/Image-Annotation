import React, { useEffect, useState, useRef } from "react";
import * as d3 from "d3";
import { convexHull, concaveHull } from "./math/hulls";
import visvalingamDownsampling from "./math/visvalingamDownsampling";
import {
  updatePath,
  drawPath,
  drawPolygon,
  drawCircle,
  dragHandlers,
} from "./svg/draw";
import { updateEventListeners, stringFromPoints } from "./utils/utilsFunctions";
import longestEdgeUpsampling from "./math/longestEdgeUpsampling";

const ImageAnnotation = () => {
  const [chosenHull, setChosenHull] = useState("convex");
  const [numberOfVertices, setNumberOfVertices] = useState("15");
  let drawing = false;
  let path;
  let points = [];
  const hullFunction = useRef(convexHull);
  const iVertices = useRef(15);
  let dragPolygon;
  let dragVertex;
  const aHull = useRef([]);

  const onMove = (e) => {
    const point = d3.pointer(e);
    // fallback mechanism not ot push same points to array
    if (
      !points.length ||
      point[0] !== points[points.length - 1].x ||
      point[1] !== points[points.length - 1].y
    )
      points.push({ x: point[0], y: point[1] });
    updatePath(path);
  };

  const onPress = () => {
    drawing = true;
    points = [];
    path = drawPath(points);

    d3.select("#sketchpad").on("mousemove", onMove);
  };

  const onLeave = () => {
    d3.select("#sketchpad").on("mousemove", null);

    if (!drawing) return;
    drawing = false;
  };

  const onUp = () => {
    // clear hand-drawn path/previously rendered polygon
    d3.select("#sketchpad").selectAll("*").remove();

    // // gift wrapping + Visvalingam downsampling
    aHull.current = visvalingamDownsampling(
      hullFunction.current(points, points.length),
      iVertices.current
    );
    const sPoints = stringFromPoints(aHull.current);
    const polygon = drawPolygon(sPoints);
    const circles = drawCircle(aHull.current);

    // create drag handlers
    [aHull.current, dragVertex, dragPolygon] = dragHandlers(aHull.current);

    // initialize event handling
    dragVertex(circles);
    dragPolygon(polygon);
  };

  useEffect(() => {
    updateEventListeners(onPress, onUp, onLeave);
  }, []); // componentDidMount behaviour

  // event handlers
  const handleHullTypeChange = (evt) => {
    // update state for radio button and reattach events for svg to use proper hull function
    if (evt.target.value === "convex") {
      setChosenHull("convex");
      hullFunction.current = convexHull;
    } else {
      setChosenHull("concave");
      hullFunction.current = concaveHull;
    }
    updateEventListeners(onPress, onUp, onLeave);
  };

  const handleVertexNumberChange = (evt) => {
    // make input for vertices editable
    setNumberOfVertices(evt.target.value);
    updateEventListeners(onPress, onUp, onLeave);
  };

  const handleSubmit = (evt) => {
    // update number of vertices and hull function, reattach events
    evt.preventDefault();
    iVertices.current = parseInt(numberOfVertices, 10);
    updateEventListeners(onPress, onUp, onLeave);
  };

  const handlePlus = () => {
    // add one vertex on longest edge
    // update vertex counter
    setNumberOfVertices(parseInt(numberOfVertices, 10) + 1);
    iVertices.current += 1;

    // clear hand-drawn path/previously rendered polygon
    d3.select("#sketchpad").selectAll("*").remove();

    // Upsampling by 1
    aHull.current = longestEdgeUpsampling(aHull.current);
    const sPoints = stringFromPoints(aHull.current);
    const polygon = drawPolygon(sPoints);
    const circles = drawCircle(aHull.current);

    // create drag handlers
    [aHull.current, dragVertex, dragPolygon] = dragHandlers(aHull.current);

    // initialize event handling
    dragVertex(circles);
    dragPolygon(polygon);
    updateEventListeners(onPress, onUp, onLeave);
  };

  const handleMinus = () => {
    // remove one vertex using Visvalingam algorithm
    // update vertex counter
    setNumberOfVertices(numberOfVertices - 1);
    iVertices.current -= 1;

    // clear hand-drawn path/previously rendered polygon
    d3.select("#sketchpad").selectAll("*").remove();

    // Visvalingam downsampling by 1
    aHull.current = visvalingamDownsampling(
      aHull.current,
      aHull.current.length - 1
    );
    const sPoints = stringFromPoints(aHull.current);
    const polygon = drawPolygon(sPoints);
    const circles = drawCircle(aHull.current);

    // create drag handlers
    [aHull.current, dragVertex, dragPolygon] = dragHandlers(aHull.current);

    // initialize event handling
    dragVertex(circles);
    dragPolygon(polygon);
    updateEventListeners(onPress, onUp, onLeave);
  };

  return (
    <div>
      <svg id="sketchpad" width="600" height="300" />
      <div className="wrapper">
        <div className="radio">
          <input
            label="Convex"
            type="radio"
            id="convexRadio"
            value="convex"
            checked={chosenHull === "convex"}
            onChange={handleHullTypeChange}
          />
          <input
            label="Concave"
            type="radio"
            id="concaveRadio"
            value="concave"
            checked={chosenHull === "concave"}
            onChange={handleHullTypeChange}
          />
        </div>
        <div className="vertex">
          <form onSubmit={handleSubmit}>
            Number of vertices:
            <input
              type="text"
              value={numberOfVertices}
              id="vertexNumber"
              onChange={handleVertexNumberChange}
            />
            <button id="submitVertices" type="submit">
              Set
            </button>
          </form>
        </div>
        <div className="verticesPlusMinus">
          <span>Vertices:</span>
          <button type="button" onClick={handlePlus}>
            +
          </button>
          <button type="button" onClick={handleMinus}>
            -
          </button>
        </div>
      </div>
    </div>
  );
};

export default ImageAnnotation;
