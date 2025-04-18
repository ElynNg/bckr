import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { formatDateToYYYYMMDD } from "utils/utils";
import { CalendarDots } from "@phosphor-icons/react";
import { useSelector } from "react-redux";

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p className="label">{`${label}`}</p>
        <p className="desc">{`완료 프로젝트: ${payload[0]?.value}`}건</p>
      </div>
    );
  }

  return null;
};

const processData = (dateArr) => {
  const data = useSelector((state) => state.v2_overview.content).studies;

  let chartData = dateArr.map((date) => {
    return {
      date: date.slice(5),
      value: data.filter(
        (item) =>
          formatDateToYYYYMMDD(item.update_date, ".") === date && item.status_name.includes("완료"),
      ).length,
    };
  });

  return chartData;
};

export const WholeProjectOverview = () => {
  const dateArr = Array.from({ length: 14 }, (_, i) => {
    let date = new Date();
    date.setDate(date.getDate() - 14 + i);
    return formatDateToYYYYMMDD(date, ".");
  });

  const chartData = processData(dateArr);

  return (
    <div className="chart-wrapper">
      <div className="chart-title">
        <p>작업 진행도</p>
        <p style={{ position: "relative", top: "-.8rem", float: "right" }}>
          {dateArr[0]} ~ {dateArr[dateArr.length - 1]}
          <span>
            <CalendarDots
              size={30}
              color="black"
              style={{ position: "relative", top: ".5rem", left: ".3rem" }}
            />
          </span>
        </p>
      </div>
      <div className="chart-container">
        <ResponsiveContainer width="100%" height={"95%"} padding={"2rem"}>
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis domain={[0, Math.max(...chartData.map((item) => item.value)) * 1.5]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Line
              type="monotone"
              dataKey="value"
              stroke="#e76f51"
              activeDot={{ r: 8 }}
              name="건수"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
