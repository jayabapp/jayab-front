const maskPhoneNumber = (phoneNumber: string) => {
  const digitsOnly = phoneNumber.replace(/\D/g, "");
  if (digitsOnly.length < 8) return phoneNumber;
  const firstPart = digitsOnly.substring(0, Math.floor(digitsOnly.length - 4));
  const lastPart = digitsOnly.substring(Math.ceil(digitsOnly.length - 2));
  const maskedNumber = lastPart + "**" + firstPart;
  return maskedNumber;
};

export default maskPhoneNumber;
