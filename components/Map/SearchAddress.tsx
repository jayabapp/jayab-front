"use client";
type getAddressType = {
  center: number[];
  search: string;
  setSearchedAddress: (e: any) => void | null;
  setSearchedAddressLoading: (e: boolean) => void | null;
};

const getAddresses = async ({ search, setSearchedAddress, setSearchedAddressLoading, center }: getAddressType) => {
  setSearchedAddressLoading(true);
  await fetch(`https://api.neshan.org/v1/search?term=${search}&lat=${center[1]}&lng=${center[0]}`, {
    method: "GET",
    headers: {
      "Api-Key": `service.ccf9503665084eea9ee219b2c47b4ec3`,
    },
  })
    .then((response) => response.json())
    .then((res) => {
      setSearchedAddressLoading(false);
      setSearchedAddress(res?.items);
    })
    .catch((error) => {
      setSearchedAddressLoading(false);
      // console.error(error);
    });
};

export default getAddresses;
