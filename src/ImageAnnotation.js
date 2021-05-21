import React, { useEffect, useState } from "react";
import * as d3 from "d3";
import { convexHull, concaveHull } from "./math/hulls";
import dummyDownsampling from "./math/dummyDownsampling";
import { updatePath, drawPath, drawPolygon, drawCircle } from "./svg/draw";
import clearAll from "./utils/utilsFunctions";

const ImageAnnotation = () => {
  const [chosenHull, setChosenHull] = useState("convex");
  // const [hullFunction, setHullFunction] = useState(convexHull);
  let drawing = false;
  let path;
  let points = [];
  let hullFunction = convexHull;

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

    // gift wrapping + some downsampling
    const aHull = dummyDownsampling(hullFunction(points, points.length));
    const sPoints = aHull
      .reduce((sum, curr) => `${sum + curr.x},${curr.y} `, "")
      .trim();
    const polygon = drawPolygon(sPoints);
    const circles = drawCircle(aHull);

    // handlers on currently edited objects
    let currCircle;
    let currCircles;
    let currIndex;
    let currPolygon;

    // add new event handlers for dragging: vertex - extend polygon, polygon - move polygon
    let dragPolygon;
    const dragVertex = d3
      .drag()
      .on("start", (e, d) => {
        // find chosen circle and its index in convex hull
        currCircle = e.sourceEvent.currentTarget;
        currIndex = aHull.findIndex((elem) => elem.x === d.x && elem.y === d.y);
      })
      .on("drag", (e) => {
        const point = d3.pointer(e);

        // clear everything (helps with keeping vertices over polygon)
        clearAll(currPolygon, currCircles);

        // edit position of dragged circle and update hull
        d3.select(currCircle).attr("cx", point[0]).attr("cy", point[1]);
        aHull[currIndex] = { x: point[0].toString(), y: point[1].toString() };
        const sPoints2 = aHull
          .reduce((sum, curr) => `${sum + curr.x},${curr.y} `, "")
          .trim();

        // draw new polygon and vertices, attach event handlers
        currPolygon = drawPolygon(sPoints2);
        currCircles = drawCircle(aHull);
        dragPolygon(currPolygon);
        dragVertex(currCircles);
      });

    dragPolygon = d3
      .drag()
      .on("start", (e) => {
        // get handler on polygon
        currPolygon = e.sourceEvent.currentTarget;
      })
      .on("drag", (e) => {
        // clear everything (helps with keeping vertices over polygon)
        clearAll(currPolygon, currCircles);

        // for each vertex of polygon update its position
        aHull.forEach((elem, index) => {
          aHull[index] = {
            x: (parseInt(elem.x, 10) + e.dx).toString(),
            y: (parseInt(elem.y, 10) + e.dy).toString(),
          };
        });
        const sPoints2 = aHull
          .reduce((sum, curr) => `${sum + curr.x},${curr.y} `, "")
          .trim();

        // draw new polygon and vertices, attach event handlers
        currPolygon = drawPolygon(sPoints2);
        currCircles = drawCircle(aHull);
        dragPolygon(currPolygon);
        dragVertex(currCircles);
      });

    // initialize event handling
    dragVertex(circles);
    dragPolygon(polygon);
  };

  useEffect(() => {
    d3.select("#sketchpad")
      .on("mousedown", onPress)
      .on("mouseup", onUp)
      .on("mouseleave", onLeave);
  }, []); // componentDidMount behaviour

  const handleChange = (evt) => {
    // update state for radio button and reattach events for svg to use proper hull function
    if (evt.target.value === "convex") {
      setChosenHull("convex");
      hullFunction = convexHull;
      d3.select("#sketchpad")
        .on("mousedown", onPress)
        .on("mouseup", onUp)
        .on("mouseleave", onLeave);
    } else {
      setChosenHull("concave");
      hullFunction = concaveHull;
      d3.select("#sketchpad")
        .on("mousedown", onPress)
        .on("mouseup", onUp)
        .on("mouseleave", onLeave);
    }
  };
  return (
    <div>
      <svg id="sketchpad" width="600" height="300" />
      <div className="radio">
        <input
          label="Convex"
          type="radio"
          id="convexRadio"
          value="convex"
          checked={chosenHull === "convex"}
          onChange={handleChange}
        />
        <input
          label="Concave"
          type="radio"
          id="concaveRadio"
          value="concave"
          checked={chosenHull === "concave"}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default ImageAnnotation;
