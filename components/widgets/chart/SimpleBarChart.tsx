import numberWithCommas from "@/helpers/numberWithCommas";
import moment from "moment-jalaali";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

const SimpleBarChart = ({ data }: { data: any }) => {
  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="custom-tooltip shadow transition-all bg-white rounded-lg p-2">
          <p className="label">{`${moment(label).format("jYYYY/jMM/jDD")} `}</p>
          <p className="intro"> نمایش : {numberWithCommas(payload[0].value)} </p>
        </div>
      );
    }

    return null;
  };

  const Max = Math.max(...data.map((i: any) => i.value));
  const ticks = Array.from(
    { length: Max / 10 <= 1 ? Max / 2 + 1 : 11 },
    (_, idx) => idx * (Max / 10 <= 1 ? 2 : Max / 100 < 1 ? 10 : Math.round(Max / 10))
  );
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart
        // stackOffset="expand"
        // height={300}
        data={data}
        margin={{
          top: 5,
          right: 5,
          left: -15,
          bottom: 5,
        }}
      >
        {/* <CartesianGrid strokeDasharray="3 3" /> */}
        <XAxis
          dataKey="date"
          tickFormatter={(value) => {
            if (moment(value).isSame(moment(), "day")) {
              return "امروز";
            }
            return moment(value).format("jMM/jDD") || "";
          }}
          tickMargin={5}
          // tick={{ textAnchor: "start", }}
          // angle={-90}
          stroke="#C8CBD0"
          // textAnchor="middle"
          fontSize={12}
          textAnchor="middle"

          // tick={(props) => <CustomizedAxisTick {...props} />}
        />
        <YAxis
          textAnchor="start"
          interval={0}
          fontSize={12}
          ticks={ticks}
          tickFormatter={(value) => numberWithCommas(value) || ""}
          type="number"
          tickMargin={5}
          // tickMargin={50}
          domain={Max ? [0, Max % 2 == 0 ? Max : Max + 1] : ["dataMin", "dataMax"]}
          stroke="#C8CBD0"
          className="bg-red-800"

          // tick={{ fontSize: 12, color: "red" }}
        />
        {/* <Tooltip /> */}
        {/* <Legend /> */}

        <Tooltip
          content={(e) => <CustomTooltip active={e?.active} label={e?.label} payload={e?.payload} key={e?.label} />}
        />
        <Line dataKey="value" type={"linear"} fill="#3886E5" strokeWidth={"3px"} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default SimpleBarChart;
