import { useSelector } from "react-redux";
import { calcProgressRate } from "../../../../utils/utils";
import { ProjectStudyData } from "../components/charts/pie";
import { AssignedWorkerTable } from "../components/table";
import { DailyStudyProcessTracking, StudyStatusByWorker } from "../components/charts/bar";

export const ProjectDetailed = ({ selectedProjectId }) => {
  const data = useSelector((state) => state.v2_overview.content);
  const prj = data.projects.filter((item) => item.project_seq === selectedProjectId);
  const studies = data.studies.filter((item) => item.project_seq === selectedProjectId);
  const progressRate = studies && studies.length === 0 ? 0 : calcProgressRate(studies);
  const members =
    studies && studies.length === 0 ? 0 : [...new Set(studies.map((item) => item.m_seq))].length;
  const groups = [...new Set(prj.map((item) => item.group_seq))].map((seq) => {
    if (seq) return prj.find((item) => item.group_seq === seq).group_name;
    return "-";
  });

  return (
    <>
      <div className="project-modal-wrapper">
        <div className="project-modal-title">{prj[0].title}</div>
        <div className="project-modal-body">
          <div className="project-content-section">
            <div className="area-50">
              <div className="project-content-section-header">
                <p>프로젝트 상세 정보</p>
              </div>
              <div className="project-content-section-body">
                <div>
                  <p>
                    프로젝트 개시일: <span>{prj[0].start_date}</span>
                  </p>
                  <p>
                    프로젝트 종료일: <span>{prj[0].end_date}</span>
                  </p>
                  <p>
                    프로젝트 진척률: <span>{progressRate}%</span>
                  </p>
                  <p>
                    프로젝트 작업자수:
                    <span> {members}</span>
                  </p>
                </div>
                <div>
                  <p>
                    프로젝트 생성일: <span>{prj[0].reg_date}</span>
                  </p>
                  <p>
                    프로젝트 업데이트일: <span>{prj[0].update_date}</span>
                    {/* 최근 작업 업데이 시각으로 세팅? */}
                  </p>
                  <p>
                    프로젝트 참여 그룸의 수:
                    <span> {groups.filter((item) => item != "-").length}</span>
                  </p>
                  <p>
                    프로젝트 참여 그룸:
                    <span>
                      {" "}
                      {groups.slice(0, 2)}
                      {groups.length > 2 ? "..." : ""}
                    </span>
                  </p>
                </div>
              </div>
            </div>

            <div className="area-50">
              <div className="project-content-section-header">
                <p>작업 진행도</p>
              </div>

              <div className="project-content-section-body" style={{ height: "90%" }}>
                <div style={{ width: "100%" }}>
                  <ProjectStudyData projectId={selectedProjectId} />
                </div>
              </div>
            </div>
          </div>

          <div className="project-content-section">
            <div id="assigned-worker-area" className="area-40">
              <div className="project-content-section-header">
                <p>배정된 작업자 목록</p>
              </div>

              <div className="project-content-section-body">
                <AssignedWorkerTable projectId={selectedProjectId} />
              </div>
            </div>

            <div className="area-60">
              <DailyStudyProcessTracking
                projectId={selectedProjectId}
                title={"일별 작업 진행현황"}
              />
            </div>
          </div>

          <div className="project-content-section">
            <div className="area-100">
              <div className="project-content-section-header">
                <p>작업자별 작업 진행 현황</p>
              </div>
              <div className="project-content-section-body">
                <div className="chart-wrapper">
                  <div className="chart-container">
                    <StudyStatusByWorker projectId={selectedProjectId} layout="horizontal" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
