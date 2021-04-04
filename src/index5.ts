export const xx = {};

if (JSON.stringify(xx) === JSON.stringify({})) {
  console.log(JSON.stringify(xx) === JSON.stringify({}) ? 0 : xx);
} else {
  console.log('not');
}
