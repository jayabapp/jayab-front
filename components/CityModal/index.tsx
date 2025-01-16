import React from "react";
import Modal from "../Modal";
import { useQuery } from "@tanstack/react-query";
import { CityService } from "@/api_services/city/city.service";

const CityModal = ({ show, onHide }: { show: boolean; onHide: () => void | null }) => {
  const { data: provinces } = useQuery({
    queryFn: CityService.GetProvince,
    queryKey: [CityService.CITIES_CACHEKEY],
  });

  const { data: cities } = useQuery({
    queryFn: () => {
      if (!!values?.province) return CityService.GetCities({ parentId: values?.province });
      else return [];
    },
    queryKey: [CityService.CITIES_CHILDEREN_CACHEKEY, values?.province],
  });
  return (
    <Modal onHide={onHide} show={!!show}>
      CityModal
    </Modal>
  );
};

export default CityModal;
