import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useSelector } from "react-redux";
import { statusList } from "../../../../../utils/common";
import { formatDateToYYYYMMDD, checkStatus, getLatestData } from "../../../../../utils/utils";
import { DEFAULT_COLOR } from "../../../../../utils/color";

const CustomTooltip = ({ active, payload, label }) => {
  if (active) {
    return (
      <div className="custom-tooltip">
        {Object.keys(payload).map((key, index) => {
          return (
            <p key={index}>
              <span style={{ fontWeight: "bold" }}>{payload[key].name}</span>: {payload[key].value}
            </p>
          );
        })}
      </div>
    );
  }

  return null;
};

export const DailyStudyProcessTracking = ({ projectId, title }) => {
  let data = useSelector((state) => state.v2_overview.content)?.studies?.filter(
    (item) => !projectId || item.project_seq === projectId,
  );

  const dateArr = Array.from({ length: 10 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return formatDateToYYYYMMDD(date, "-");
  }).sort((a, b) => {
    return new Date(a) - new Date(b);
  });

  const chartData = dateArr.map((date) => {
    const filteredData = data.filter((item) => item.update_date.includes(date));
    const obj = { date };

    Object.keys(statusList).forEach((key) => {
      const statusCount = filteredData.filter((item) =>
        checkStatus(item.status_name, statusList[key].value),
      ).length;
      obj[key] = statusCount;
    });
    return obj;
  });

  const chartMax =
    Math.max(
      ...chartData.map((item) =>
        Object.values(item)
          .filter((value) => !isNaN(value))
          .reduce((sum, value) => sum + value, 0),
      ),
    ) * 1.5;

  return (
    <>
      <div className="project-content-section-header">
        <p>{title}</p>
      </div>

      <div className="project-content-section-body">
        <div className="chart-wrapper">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} domain={[0, chartMax]} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Legend verticalAlign="top" height={36} iconSize={10} iconType="circle" />
                {Object.keys(statusList).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={statusList[key].color}
                    name={statusList[key].name}
                    barSize={20}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export const ProgressStatusByTask = () => {
  const data = useSelector((state) => state.v2_overview.content);
  const studies = getLatestData(data.studies);

  const projectId = [...new Set(data.projects.map((item) => item.project_seq))];
  const chartData = projectId.map((id) => {
    const filteredData = studies.filter((item) => item.project_seq === id);

    const obj = { project: data.projects.find((item) => item.project_seq === id).title };

    Object.keys(statusList).forEach((key) => {
      const statusCount = filteredData.filter((item) =>
        checkStatus(item.status_name, statusList[key].value),
      ).length;
      obj[key] = statusCount;
    });
    return obj;
  });

  return (
    <>
      <div className="project-content-section-header">
        <p>프로젝트별 작업 진행 상황</p>
      </div>

      <div className="project-content-section-body">
        <div className="chart-wrapper">
          <div className="chart-container">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="project" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip content={<CustomTooltip />} cursor={false} />
                <Legend verticalAlign="top" height={36} iconSize={10} iconType="circle" />

                {Object.keys(statusList).map((key) => (
                  <Bar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={statusList[key].color}
                    name={statusList[key].name}
                    barSize={20}
                  />
                ))}
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </>
  );
};

export const StudyStatusByWorker = ({ projectId, layout }) => {
  const colors = [...DEFAULT_COLOR(), ...DEFAULT_COLOR()];
  const data = getLatestData(
    useSelector((state) => state.v2_overview.content).studies.filter(
      (item) => item.project_seq === projectId,
    ),
  );

  if (!data || data.length === 0)
    return (
      <p style={{ padding: "10px", fontSize: "2rem" }}>
        해당 프로젝트는 등록된 작업 내역이 없습니다!
      </p>
    );
  const chartData = Object.keys(statusList).map((stt) => {
    const sttData = data.filter((item) => checkStatus(item.status_name, statusList[stt].value));
    const workers = [...new Set(sttData.map((item) => item.m_seq))];
    const obj = { stt };

    workers.forEach((m) => {
      const worker = sttData.find((item) => item.m_seq === m).manager;
      obj[worker] = sttData.filter((item) => item.m_seq === m).length;
    });

    return obj;
  });

  const stackKeys = [
    ...new Set(chartData.flatMap((item) => Object.keys(item).filter((key) => key !== "stt"))),
  ];

  const axisConfig =
    layout === "horizontal" ? (
      <>
        <XAxis type="number" tick={{ fontSize: 12 }} />
        <YAxis dataKey="stt" type="category" tick={{ fontSize: 12 }} />
      </>
    ) : (
      <>
        <XAxis dataKey="stt" type="category" tick={{ fontSize: 12 }} />
        <YAxis type="number" tick={{ fontSize: 12 }} />
      </>
    );

  return (
    <ResponsiveContainer width={"100%"} height={"100%"}>
      <BarChart data={chartData} layout={layout == "horizontal" ? "vertical" : "horizontal"}>
        <CartesianGrid strokeDasharray="3 3" />
        {axisConfig}
        <Tooltip content={<CustomTooltip />} cursor={false} />
        <Legend
          align="right"
          verticalAlign="top"
          layout="vertical"
          height={36}
          iconSize={10}
          iconType="circle"
        />
        {stackKeys.map((item, index) => (
          <Bar key={item} dataKey={item} stackId="a" fill={colors[index]} barSize={20} />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
};
