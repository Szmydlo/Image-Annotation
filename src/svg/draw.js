// functions to draw inside svg
import * as d3 from "d3";

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

export { updatePath, drawPath, drawPolygon, drawCircle };
