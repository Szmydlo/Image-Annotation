// functions to draw inside svg
import * as d3 from "d3";
import { clearAll } from "../utils/utilsFunctions";

const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

const updatePath = (path) => {
  path.attr("d", (d) => line(d)); // Redraw the path:
};

const drawPath = (points) =>
  d3
    .select("#sketchpad")
    .append("path")
    .data([points])
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .style("stroke", "#000");

const drawPolygon = (sPoints) =>
  d3
    .select("#sketchpad")
    .append("polygon")
    .attr("points", sPoints)
    .attr("fill", "red")
    .style("stroke", "#000");

const drawCircle = (pathArray) =>
  d3
    .select("#sketchpad")
    .selectAll("circle")
    .data(pathArray)
    .enter()
    .append("circle")
    .attr("r", 7)
    .attr("cx", (d) => d.x)
    .attr("cy", (d) => d.y);

const dragHandlers = (aPoints) => {
  const aHull = aPoints;
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

  return [aHull, dragVertex, dragPolygon];
};

export { updatePath, drawPath, drawPolygon, drawCircle, dragHandlers };
