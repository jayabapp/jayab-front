import { CSSProperties, Dispatch, useEffect, useState } from "react";

import Slider from "rc-slider";

import "rc-slider/assets/index.css";

type PriceRangeType = {
  query?: any;
  filters?: any;
  steps?: number;
  upLimit?: number;
  lowerKey: string;
  lowLimit?: number;
  higherKey: string;
  setFilters?: Dispatch<any>;
  marks?: { [key: string]: { label: number | string; style: CSSProperties } };
};

const PriceRange = ({
  steps,
  upLimit,
  filters,
  lowLimit,
  lowerKey,
  higherKey,
  setFilters,
}: PriceRangeType) => {
  const [lowerBound, SetlowerBound] = useState(lowLimit || 0);
  const [upperBound, SetupperBound] = useState(upLimit || 100000000);
  const [marks, setMarks] = useState<{
    [key: number]: { style: {}; label: number };
  }>([]);

  useEffect(() => {
    if (upLimit) SetupperBound(upLimit);
    if (lowLimit) SetlowerBound(lowLimit);
  }, [lowLimit, upLimit]);

  useEffect(() => {
    var list: { [key: number]: { style: {}; label: number } } = {};
    list[lowerBound] = {
      style: { color: "#3886E5", bottom: "-2rem" },
      label: lowerBound,
    };
    list[upperBound] = {
      style: { color: "#3886E5", bottom: "-2rem" },
      label: upperBound,
    };
    setMarks(list);
  }, [lowerBound, upperBound]);

  const onChangeFunc = (e: any) => {
    if (typeof e === "object" && setFilters) {
      if (e[1] == upperBound && e[0] == lowerBound) {
        setFilters((x: any) => ({
          ...x,
          [lowerKey]: undefined,
          [higherKey]: undefined,
        }));
      } else {
        setFilters((x: any) => ({
          ...x,
          [lowerKey]: e[0] == lowerBound && !x[higherKey] ? undefined : e[0],
          [higherKey]: e[1] == upperBound && !x[lowerKey] ? undefined : e[1],
        }));
      }
    }
  };

  return (
    <div className="mx-2">
      <Slider
        range
        reverse
        min={lowerBound}
        max={upperBound}
        step={steps || 100000}
        railStyle={{ backgroundColor: "#d1d5db", height: 4 }}
        trackStyle={{ backgroundColor: "#0088CC", height: 4 }}
        handleStyle={{
          backgroundColor: "#3886E5",
          borderWidth: 0,
          width: 20,
          height: 20,
          bottom: -4,
        }}
        activeDotStyle={{
          backgroundColor: "#10264B",
          borderColor: "#10264B",
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
        }}
        dotStyle={{
          backgroundColor: "#D6D6D6",
          borderColor: "#D6D6D6",
          borderWidth: 1,
          width: 7,
          height: 7,
          aspectRatio: 2,
          bottom: -20,
          visibility: true ? "visible" : "hidden",
        }}
        value={[
          filters?.[lowerKey] || lowerBound,
          filters?.[higherKey] || upperBound,
        ]}
        onChange={(e) => {
          onChangeFunc(e);
        }}
        defaultValue={[lowerBound, upperBound]}
      />
    </div>
  );
};

export default PriceRange;
