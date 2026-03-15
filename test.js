const arr = [
  1, 2, 3, 4, 5, 6, 7, 8, 2, 3, 2, 2, 535, 2353252, 2412412, 2341, 12414, 6, 2,
  1, 4, 7, 3, 34, 6, 32, 523, 5, 52, 235,
];

const arr2 = [...arr];

const sort = (arr) => {
  const arrObject = {};

  arr.forEach((element) => {
    if (element in arrObject) {
      arrObject[element]++;
    } else {
      arrObject[element] = 1;
    }
  });

  const arrSorted = Object.entries(arrObject).flatMap(([key, value]) =>
    Array(value).fill(Number(key)),
  );

  return arrSorted;
};

const timer = (callback) => {
  const startTime = Date.now();

  console.log(callback());

  const endTime = Date.now();

  return endTime - startTime;
};

console.log(
  "first",
  timer(() => {
    const arrToSort = arr2;
    console.log("arr before:", arrToSort);

    return sort(arrToSort);
  }),
);
console.log(
  "second",
  timer(() => {
    const arrToSort = arr;
    console.log("arr before:", arrToSort);

    return arrToSort.sort((a, b) => a - b);
  }),
);
