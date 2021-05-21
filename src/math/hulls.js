const CONCAVE_DIST = 3;
// Convex hull logic based on gift wrapping algorithm
const leftIndex = (aPoints) => {
  let minIndex = 0;
  for (let i = 0; i < aPoints.length; i += 1) {
    if (aPoints[i].x < aPoints[minIndex].x) {
      minIndex = i;
    } else if (aPoints[i].x === aPoints[minIndex].x) {
      if (aPoints[i].y > aPoints[minIndex].y) {
        minIndex = i;
      }
    }
  }
  return minIndex;
};

const orientation = (p, q, r) => {
  const value = (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
  if (value === 0) {
    return 0;
  }
  if (value > 0) {
    return 1;
  }
  return 2;
};

const convexHull = (aPoints, length) => {
  if (length < 3) {
    return [];
  }
  const leftMost = leftIndex(aPoints);
  const hullMap = new Map();
  let p = leftMost;
  let q = 0;
  while (true) {
    if (hullMap.has(`${aPoints[p].x}-${aPoints[p].y}`)) {
      break;
    } else {
      hullMap.set(`${aPoints[p].x}-${aPoints[p].y}`, 1);
    }
    // it can start looking from the beginning, that's why break statement checks if
    // there is sth in map
    q = (p + 1) % length;
    for (let i = 0; i < length; i += 1) {
      if (orientation(aPoints[p], aPoints[i], aPoints[q]) === 2) {
        q = i;
      }
    }
    p = q;
  }
  const aHull = Array.from(hullMap.keys(), (pointCoord) => {
    const coord = pointCoord.split("-");
    return { x: coord[0], y: coord[1] };
  });

  return aHull;
};

// Concave hull logic based on picking every n-th element
// output then optimized by Visvalignam algorithm
const concaveHull = (aPoints, length) => {
  if (length < 3) {
    return [];
  }
  return aPoints.filter((elem, index) => index % CONCAVE_DIST === 0);
};

export { convexHull, concaveHull };
