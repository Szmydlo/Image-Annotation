// functions to draw inside svg
import * as d3 from "d3";

const line = d3
  .line()
  .x((d) => d.x)
  .y((d) => d.y);

const updatePath = (path) => {
  path.attr("d", (d) => line(d)); // Redraw the path:
};

const drawPath = (svg, points) =>
  svg
    .append("path")
    .data([points])
    .attr("class", "line")
    .attr("d", line)
    .attr("fill", "none")
    .style("stroke", "#000");

const drawPolygon = (svg, sPoints) =>
  svg
    .append("polygon")
    .attr("points", sPoints)
    .attr("fill", "red")
    .style("stroke", "#000");

export { updatePath, drawPath, drawPolygon };
