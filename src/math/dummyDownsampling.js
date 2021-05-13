// compute distance between points, if it's less then some constant remove one point
const DISTANCE = 10;
const distance = (pointA, pointB) =>
  Math.sqrt((pointB.x - pointA.x) ** 2 + (pointB.y - pointA.y) ** 2);

const dummyDownsampling = (aPoints) => {
  const aResult = aPoints;
  for (let i = aResult.length - 1; i > 0; i -= 1) {
    if (distance(aResult[i], aResult[i - 1]) < DISTANCE) {
      aResult.splice(i, 1);
    }
  }
  return aResult;
};

module.exports = dummyDownsampling;
