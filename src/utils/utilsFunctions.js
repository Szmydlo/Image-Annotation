// utility functions
import * as d3 from "d3";

const clearAll = (svg, polygon, circles) => {
  if (polygon) {
    d3.select(polygon).on("start", null);
    d3.select(polygon).on("drag", null);
  }
  if (circles) {
    d3.select(circles).on("start", null);
    d3.select(circles).on("drag", null);
  }
  svg.selectAll("*").remove();
};

export default clearAll;
