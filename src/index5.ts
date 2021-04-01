export const data = [5, 51, 1234, 5, 23];

for (const element of data) {
  console.log(element);
  data.pop(element);
}

console.log(data);
