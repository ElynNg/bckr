import Header from "components/layout/v2/Header";
import { GearSix } from "@phosphor-icons/react";
import { useSelector } from "react-redux";
import ProjectDetail from "../components/projectDetail";

const wholeProjectView = () => {
  const data = useSelector((state) => state.v2_overview.content);

  if (!data || Object.keys(data).length === 0) return <div>Loading...</div>;

  return (
    <div className="dashboard-container">
      <Header />
      <main className="dashboard-content">
        <header className="dashboard-content-header">
          <h2 className="dashboard-content-header-title">Whole Project Overview</h2>
          <ol className="breadcrumb">
            <li>
              <a aria-label="home">
                <GearSix size={20} weight="fill" />
                <span>Setting</span>
              </a>
            </li>
            <li className="is-active">
              <a>Project</a>
            </li>
          </ol>
        </header>

        <div className="dashboard-body">
          <div
            className="dashboard-content-section row"
            style={{ height: "100%", overflow: "auto" }}
          >
            <ProjectDetail />
          </div>
        </div>
      </main>
    </div>
  );
};

export default wholeProjectView;
