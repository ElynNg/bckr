import { ProjectStudyData } from "./charts/pie";
import { StudyStatusByWorker } from "./charts/bar";
import { useSelector } from "react-redux";
import { calcProgressRate } from "../../../../utils/utils";
import { useState } from "react";
import { ProjectDetailed } from "../wholeProjectView/projectDetail.js";
import Modal from "react-modal";

Modal.setAppElement("#page");

const projectDetail = () => {
  const data = useSelector((state) => state.v2_overview.content);
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [isOpen, setIsOpen] = useState(false);

  const __handlerProjectDetailBtn = (projectId) => {
    setIsOpen(true);
    setSelectedProjectId(projectId);
  };

  const __handleClose = () => {
    setIsOpen(false);
    setSelectedProjectId(null);
  };

  return (
    <div className="project-detail-wrapper">
      <div id="all-projects">
        {[...new Set(data.projects.map((item) => item.project_seq))].map((id, index) => {
          const prj = data.projects.find((item) => item.project_seq == id);
          const studies = data.studies.filter((item) => item.project_seq === prj.project_seq);
          const progressRate = studies && studies.length === 0 ? 0 : calcProgressRate(studies);
          return (
            <div className="project-detail" key={index}>
              <div
                className="area-25"
                style={{
                  display: "grid",
                  placeItems: "center start",
                  borderRight: "solid black 1.5px",
                }}
              >
                <div className="project-detail-title">
                  <h2>{prj.title}</h2>
                  <button
                    type="button"
                    className="prj-detail-btn"
                    onClick={() => __handlerProjectDetailBtn(prj.project_seq)}
                  >
                    Detail
                  </button>
                </div>
                <p>프로젝트 담당자: {prj.manager}</p>
                <p>
                  프로젝트 기간: {prj.start_date} ~ {prj.end_date}
                </p>
                <p>프로젝트 진척률: {progressRate}%</p>
                <p>프로젝트 작업자 수: {[...new Set(studies.map((item) => item.m_seq))].length}</p>
              </div>
              <div
                className="area-35"
                style={{
                  display: "grid",
                  placeItems: "center start",
                  borderRight: "solid black 1.5px",
                  padding: "1rem",
                }}
              >
                <ProjectStudyData projectId={prj.project_seq} />
              </div>
              <div className="area-40">
                <div className="project-content-section-body">
                  <StudyStatusByWorker projectId={prj.project_seq} layout="vertical" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {selectedProjectId && (
        <Modal isOpen={isOpen} onRequestClose={__handleClose} className="project-detail-modal">
          <button onClick={__handleClose} className="close-modal-btn">
            X
          </button>
          <ProjectDetailed selectedProjectId={selectedProjectId} />
        </Modal>
      )}
    </div>
  );
};

export default projectDetail;
