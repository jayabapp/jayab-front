const numberWithCommas = (value?: number | undefined | string) => {
  if (value) {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  } else {
    return 0;
  }
};

export default numberWithCommas;
