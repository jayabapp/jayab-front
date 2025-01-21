export function chunkArray(arr: any[], n: number) {
  var chunkLength = Math.ceil(Math.max(arr.length / n, 1));
  var chunks = [];
  for (var i = 0; i < n; i++) {
    chunks.push(arr.slice(chunkLength * i, chunkLength * (i + 1)));
  }
  return chunks;
}
