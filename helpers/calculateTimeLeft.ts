type TimeLeftType = {
  days: number;
  hours: string;
  minutes: string;
  seconds: string;
};

export const calculateTimeLeft = (deadline: string):TimeLeftType => {
  if (!deadline) return { days: 0, hours: "00", minutes: "00", seconds: "00" };
  let difference = +new Date(deadline) - +new Date();

  let timeLeft: TimeLeftType;
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / 1000 / 60) % 60);
  const seconds = Math.floor((difference / 1000) % 60);
  if (difference > 0) {
    timeLeft = {
      days: days,
      hours: hours < 10 ? `0${hours}` : `${hours}`,
      minutes: minutes < 10 ? `0${minutes}` : `${minutes}`,
      seconds: seconds < 10 ? `0${seconds}` : `${seconds}`,
    };
  } else timeLeft = { days: 0, hours: "00", minutes: "00", seconds: "00" };

  return timeLeft;
};
