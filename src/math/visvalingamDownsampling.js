// Visvalingam algorithm to eliminate least important vertices
const computeArea = (aPoints, index) => {
  // compute area for triangle created by A[i-1],A[i],A[i+1]
  let prevIndex = index - 1;
  if (prevIndex === -1) {
    prevIndex = aPoints.length - 1;
  }
  const nextIndex = (index + 1) % aPoints.length;
  return Math.abs(
    aPoints[prevIndex].x * aPoints[index].y +
      aPoints[index].x * aPoints[nextIndex].y +
      aPoints[nextIndex].x * aPoints[prevIndex].y -
      aPoints[prevIndex].x * aPoints[nextIndex].y -
      aPoints[index].x * aPoints[prevIndex].y -
      aPoints[nextIndex].x * aPoints[index].y
  );
};

const visvalingamDownsampling = (aNotClosedPolygon, numberOfVertices) => {
  const aPoints = aNotClosedPolygon;
  const aAreas = [];

  aPoints.forEach((elem, index) => {
    aAreas.push(computeArea(aPoints, index));
  });

  while (aPoints.length > numberOfVertices) {
    // remove until wished number of vertices achieved
    const minimumArea = Math.min(...aAreas);
    const minIndex = aAreas.indexOf(minimumArea);
    // remove middle vertex of triangle having the smallest area
    aPoints.splice(minIndex, 1);
    aAreas.splice(minIndex, 1);

    // recompute areas for two neighbours
    let leftNeighbour = minIndex - 1;
    let rightNeighbour = minIndex;
    if (leftNeighbour < 0) {
      leftNeighbour = aPoints.length - 1;
    }
    if (rightNeighbour >= aPoints.length) {
      rightNeighbour = 0;
    }
    aAreas[leftNeighbour] = computeArea(aPoints, leftNeighbour);
    aAreas[rightNeighbour] = computeArea(aPoints, rightNeighbour);
  }

  // return optimized array of vertices
  return aPoints;
};

export default visvalingamDownsampling;
