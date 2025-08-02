const maskPhoneNumber = (phoneNumber: string) => {
  // Remove any non-digit characters for consistent processing
  const digitsOnly = phoneNumber.replace(/\D/g, "");

  // Check if the number has at least 4 digits to mask two middle ones
  if (digitsOnly.length < 4) {
    return phoneNumber; // Return original if too short to mask meaningfully
  }

  // Extract the parts of the number
  const firstPart = digitsOnly.substring(0, Math.floor((digitsOnly.length - 1) / 2));
  const lastPart = digitsOnly.substring(Math.ceil((digitsOnly.length + 2) / 2));

  // Construct the masked number
  const maskedNumber = lastPart + "**" + firstPart;

  return maskedNumber;
};

export default maskPhoneNumber;
