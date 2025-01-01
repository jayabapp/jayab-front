import numberWithCommas from "@/helpers/numberWithCommas";
import moment from "moment-jalaali";
import React from "react";
import { LineChart, Line, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const SimpleBarChart = ({ data }: { data: any }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip shadow transition-all bg-white rounded-lg p-2">
          <p className="label">{`${moment(label).format("jYYYY/jMM/jDD")} `}</p>
          <p className="intro"> مقدار : {numberWithCommas(payload[0].value)} </p>
        </div>
      );
    }

    return null;
  };
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        stackOffset="expand"
        // width={500}
        // height={300}
        data={data}
        margin={{
          bottom: 35,
        }}
      >
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis
          dataKey="date"
          tickFormatter={(value) => moment(value).format("jMM/jDD") || ""}
          tickMargin={10}
          tick={{ textAnchor: "start", dx: -6 }}
          angle={-90}
        />
        <YAxis
          tickFormatter={(value) => numberWithCommas(value) || ""}
          type="number"
          tickMargin={35}
          // tick={{ fontSize: 12, color: "red" }}
        />
        {/* <Tooltip /> */}
        {/* <Legend /> */}

        <Tooltip
          content={(e) => <CustomTooltip active={e?.active} label={e?.label} payload={e?.payload} key={e?.label} />}
        />
        <Line dataKey="value" type={"monotone"} fill="#3886E5" />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
