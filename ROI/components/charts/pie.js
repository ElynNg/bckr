import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { useSelector } from "react-redux";
import { statusList } from "../../../../../utils/common";
import { checkStatus, roundDecimal, getLatestData } from "../../../../../utils/utils";

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        <p>
          <span style={{ fontWeight: "bold" }}>{payload[0].name}</span>
          {": "}
          <span>{payload[0].value}%</span>
        </p>
      </div>
    );
  }
};

export const DailyProcessTracking = () => {
  const data = getLatestData(useSelector((state) => state.v2_overview.content).studies);
  const chartData = Object.keys(statusList).map((stt, index) => {
    return {
      stt,
      value: roundDecimal(
        (data.filter((item) => checkStatus(item.status_name, statusList[stt].value)).length /
          data.length) *
          100,
        2,
      ),
      color: statusList[stt].color,
    };
  });

  return (
    <>
      <div className="chart-wrapper">
        <div className="chart-title">
          <p>일별 작업 진행</p>
        </div>

        <div className="chart-container">
          <ResponsiveContainer width="100%" height={"100%"} padding={"1.5rem"}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="stt"
                cx="50%"
                cy="50%"
                innerRadius={90}
                outerRadius={150}
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#000000" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                content={({ payload }) => {
                  return (
                    <ul className="custom-legend">
                      {payload.map((entry, index) => (
                        <li
                          key={`item-${index}`}
                          style={{ color: entry.color }}
                          className="custom-legend-item"
                        >
                          <span
                            className="legend-marker"
                            style={{
                              backgroundColor: entry.color,
                            }}
                          ></span>
                          {entry.value} - {entry.payload.value}%
                        </li>
                      ))}
                    </ul>
                  );
                }}
                layout="vertical"
                align="right"
                verticalAlign="middle"
              />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </>
  );
};

export const ProjectStudyData = ({ projectId }) => {
  const data = getLatestData(
    useSelector((state) => state.v2_overview.content).studies.filter(
      (item) => item.project_seq === projectId,
    ),
  );
  const chartData =
    !data || data.length === 0
      ? [{ stt: "empty", value: 100, color: "#f0f0f0" }]
      : Object.keys(statusList).map((stt, index) => {
          let count = data?.filter((item) =>
            checkStatus(item.status_name, statusList[stt].value),
          ).length;
          return {
            stt,
            value: roundDecimal((count / data.length) * 100, 1),
            color: statusList[stt].color,
          };
        });

  const totalProcess = chartData.reduce((acc, cur) => {
    if (cur.stt.includes("완료")) return acc + cur.value;
    return acc;
  }, 0);

  return (
    <div className="chart-wrapper">
      <div className="chart-container row" style={{ height: "100%", padding: "0" }}>
        <div style={{ flex: "0 0 59%", maxWidth: "59%", height: "100%" }}>
          <ResponsiveContainer width={"100%"} padding={"1.5rem"}>
            <RechartsPieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="stt"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} stroke="#000000" strokeWidth={2} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </RechartsPieChart>
          </ResponsiveContainer>
        </div>
        <div style={{ flex: "0 0 40%", maxWidth: "40%", height: "100%" }}>
          <ul>
            {Object.keys(statusList).map((stt, index) => {
              const studyRate = chartData.find((item) => item.stt === stt);
              return (
                <li
                  key={`item-${index}`}
                  style={{ display: "flex", justifyContent: "space-between", padding: "10px" }}
                >
                  <div style={{ display: "flex" }}>
                    <span
                      className="legend-marker"
                      style={{ backgroundColor: statusList[stt].color }}
                    ></span>
                    <p style={{ padding: "0" }}>{stt}</p>
                  </div>
                  <p style={{ float: "right", padding: "0" }}>
                    {studyRate == undefined ? 0 : studyRate.value}
                  </p>
                </li>
              );
            })}
          </ul>
          <hr></hr>
          <p>
            Total: <span style={{ color: "black", float: "right" }}>{data?.length}</span>
          </p>
          <p>
            Progress: <span style={{ color: "black", float: "right" }}>{totalProcess}%</span>
          </p>
        </div>
      </div>
    </div>
  );
};
