const MinMaxRandom = () => {
  const max = 300;
  const min = max - 60;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default MinMaxRandom;
