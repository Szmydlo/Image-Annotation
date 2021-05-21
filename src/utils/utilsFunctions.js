// utility functions
import * as d3 from "d3";

const clearAll = (polygon, circles) => {
  if (polygon) {
    d3.select(polygon).on("start", null);
    d3.select(polygon).on("drag", null);
  }
  if (circles) {
    d3.select(circles).on("start", null);
    d3.select(circles).on("drag", null);
  }
  d3.select("#sketchpad").selectAll("*").remove();
};

const updateEventListeners = (onPress, onUp, onLeave) => {
  d3.select("#sketchpad")
    .on("mousedown", onPress)
    .on("mouseup", onUp)
    .on("mouseleave", onLeave);
};

export { clearAll, updateEventListeners };
