import { Line, LineChart, XAxis, YAxis } from "recharts";
import { ResponsiveContainer, Tooltip } from "recharts";
import { chartSteps } from "@/utils/constantss";
import { colors } from "@/theme/colors";

import numberWithCommas from "@/helpers/numberWithCommas";
import moment from "moment-jalaali";

const ViewsChart = ({ data }: { data: any }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip shadow transition-all bg-white rounded-lg p-2">
          <p className="label">{`${moment(label).format("jYYYY/jMM/jDD")} `}</p>
          <p className="intro">
            {" "}
            نمایش : {numberWithCommas(payload[0].value)}{" "}
          </p>
        </div>
      );
    }

    return null;
  };

  const Max = Math.max(...data.map((i: any) => i.value));
  const ticks = Array.from(
    { length: 11 },
    (_, idx) =>
      idx *
      (Max > 100
        ? Math.ceil(Max / 10)
        : (Object.entries(chartSteps)?.find(
            ([, value]) =>
              Number(Max) <= Number(value?.[1]) &&
              Number(Max) >= Number(value?.[0]),
          )?.[0] as any)),
  );

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: -15,
          bottom: 5,
        }}
      >
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            if (moment(value).isSame(moment(), "day")) return "امروز";
            return moment(value).format("jMM/jDD") || "";
          }}
          tickMargin={5}
          stroke={colors.neutral[300]}
          fontSize={12}
          textAnchor="middle"
        />
        <YAxis
          interval={0}
          fontSize={12}
          ticks={ticks}
          type="number"
          tickMargin={5}
          textAnchor="start"
          tickFormatter={(value) => numberWithCommas(value) || ""}
          domain={
            Max ? [0, Max % 2 == 0 ? Max : Max + 1] : ["dataMin", "dataMax"]
          }
          stroke={colors.neutral[300]}
          className="bg-red-800"
        />
        <Tooltip
          content={(e) => (
            <CustomTooltip
              key={e?.label}
              label={e?.label}
              active={e?.active}
              payload={e?.payload}
            />
          )}
        />
        <Line
          dataKey="value"
          type={"linear"}
          strokeWidth={"3px"}
          fill={colors.brand[500]}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ViewsChart;
