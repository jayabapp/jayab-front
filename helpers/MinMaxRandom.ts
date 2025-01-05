const MinMaxRandom = () => {
  const max = 60;
  const min = max - 20;
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export default MinMaxRandom;
