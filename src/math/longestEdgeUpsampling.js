// Longest edge algorithm to add vertex in longest edge
const computeLength = (aPoints, index) => {
  // compute length between  A[i],A[i+1]
  const nextIndex = (index + 1) % aPoints.length;
  return Math.sqrt(
    (aPoints[nextIndex].x - aPoints[index].x) ** 2 +
      (aPoints[nextIndex].y - aPoints[index].y) ** 2
  );
};

const computeMiddlePoint = (aPoints, pointA, pointB) => ({
  // compute x and y for new point
  x: (parseInt(aPoints[pointA].x, 10) + parseInt(aPoints[pointB].x, 10)) / 2,
  y: (parseInt(aPoints[pointA].y, 10) + parseInt(aPoints[pointB].y, 10)) / 2,
});

const longestEdgeUpsampling = (aNotClosedPolygon) => {
  const aPoints = aNotClosedPolygon;
  const aLengths = [];

  aPoints.forEach((elem, index) => {
    aLengths.push(computeLength(aPoints, index));
  });

  const longestEdge = Math.max(...aLengths);
  const maxIndex = aLengths.indexOf(longestEdge);
  // add point in the middle of longest edge
  const newAssignment = (maxIndex + 1) % aPoints.length;
  const newPoint = computeMiddlePoint(aPoints, maxIndex, newAssignment);
  aPoints.splice(newAssignment, 0, newPoint);
  aLengths.splice(newAssignment, 0, newPoint);

  // return optimized array of vertices
  return aPoints;
};

export default longestEdgeUpsampling;
