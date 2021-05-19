import React, { useEffect } from "react";
import * as d3 from "d3";
import convexHull from "./math/convexHull";
import dummyDownsampling from "./math/dummyDownsampling";
import { updatePath, drawPath, drawPolygon } from "./svg/draw";

const ImageAnnotation = () => {
  let drawing = false;
  let path;
  let points = [];
  let svg;

  const onMove = (e) => {
    const point = d3.pointer(e);
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
    path = drawPath(svg, points);

    svg.on("mousemove", onMove);
  };

  const onLeave = () => {
    svg.on("mousemove", null);

    if (!drawing) return;
    drawing = false;
  };

  const onUp = () => {
    svg.selectAll("*").remove();
    const aHull = dummyDownsampling(convexHull(points, points.length));
    const sPoints = aHull
      .reduce((sum, curr) => `${sum + curr.x},${curr.y} `, "")
      .trim();
    drawPolygon(svg, sPoints);
  };

  useEffect(() => {
    svg = d3.select("#sketchpad");
    svg.on("mousedown", onPress).on("mouseup", onUp).on("mouseleave", onLeave);
  }, []); // componentDidMount behaviour

  return <svg id="sketchpad" width="600" height="300" />;
};

export default ImageAnnotation;
