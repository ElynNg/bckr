import Header from "components/layout/v2/Header";
import { GearSix } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import Calendar from "../components/calendar";
import { WholeProjectOverview } from "../components/charts/line";
import { DailyProcessTracking } from "../components/charts/pie";
import { addComma, checkIsCompletedProject, getLatestData } from "../../../../utils/utils";

const Overview = () => {
  const data = useSelector((state) => state.v2_overview.content);

  if (!data || Object.keys(data).length === 0) return <div>Loading...</div>;

  return (
    <div className="dashboard-container" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
      <Header />
      <main className="dashboard-content">
        <header className="dashboard-content-header">
          <h2 className="dashboard-content-header-title">Dashboard Overview</h2>
          <ol className="breadcrumb">
            <li>
              <a aria-label="home">
                <GearSix size={20} weight="fill" />
                <span>Setting</span>
              </a>
            </li>
            <li className="is-active">
              <a>Dashboard</a>
            </li>
          </ol>
        </header>

        <div className="dashboard-body">
          <section className="dashboard-content-section row" style={{ padding: "4rem" }}>
            {summarizeItems(data).map((item, index) => {
              return (
                <div className="summarize-item" key={index}>
                  <div className="summarize-item-image">
                    <img src={item.image} />
                  </div>
                  <div className="summarize-item-title">{item.title}</div>
                  <div className="summarize-item-content">
                    <span style={{ color: item.color }}>{item.value}</span>
                  </div>
                </div>
              );
            })}
          </section>
          <section className="dashboard-content-section row" style={{ height: "50vh" }}>
            <div className="area-50">
              <WholeProjectOverview />
            </div>
            <div className="area-50">
              <DailyProcessTracking />
            </div>
          </section>
          <section className="dashboard-content-section row" style={{ height: "80vh" }}>
            <Calendar />
          </section>
        </div>
      </main>
    </div>
  );
};

const summarizeItems = (data) => {
  if (!data || data.length === 0) return;
  return [
    {
      title: "전체 프로젝트 수",
      value: addComma([...new Set(data.projects.map((item) => item.project_seq))].length),
      color: "#2a9d8f",
      image: "/img/overview_pic1.png",
    },
    {
      title: "작업자 수",
      value: addComma([...new Set(data.studies.map((item) => item.m_seq))].length),
      color: "#e76f51",
      image: "/img/overview_pic2.png",
    },
    {
      title: "진행 중인 프로젝트 수",
      value: addComma(
        [
          ...new Set(
            data.projects
              .filter((item) => !checkIsCompletedProject(item.project_seq, data.studies))
              .map((item) => item.project_seq),
          ),
        ].length,
      ),
      color: "#e9c46a",
      image: "/img/overview_pic3.png",
    },
    {
      title: "진행 중인 작업 수",
      value: addComma(getOnProcessPrj(data.studies)),
      color: "#f4a261",
      image: "/img/overview_pic4.png",
    },
  ];
};

const getOnProcessPrj = (data) => {
  if (!data || data.length === 0) return 0;
  const onProcessPrj = getLatestData(data).filter((item) => !item.status_name.includes("완료"));
  return onProcessPrj.length;
};

export default Overview;
