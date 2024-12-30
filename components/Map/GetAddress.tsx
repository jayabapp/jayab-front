"use client";
type getAddressType = {
  latitude: number;
  longitude: number;
  setCenterAddress?: (e: string) => void | null;
  setCenterAddressLoading?: (e: boolean) => void | null;
};

const getAddress = async ({ latitude, longitude, setCenterAddress, setCenterAddressLoading }: getAddressType) => {
  if (setCenterAddressLoading) {
    setCenterAddressLoading(true);
  }
  await fetch(`https://api.neshan.org/v5/reverse?lat=${latitude}&lng=${longitude}`, {
    method: "GET",
    headers: {
      "Api-Key": `service.2d9582117247413d841688dfb213d1b6`,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      if (setCenterAddressLoading) setCenterAddressLoading(false);
      if (setCenterAddress) setCenterAddress(res?.formatted_address);
    })
    .catch((error) => {
      if (setCenterAddressLoading) setCenterAddressLoading(false);
      // console.error(error);
    });
};

export default getAddress;
