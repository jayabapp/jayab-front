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
      "Api-Key": `service.2d7bb2fede1d4108ac849863562173de`,
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
