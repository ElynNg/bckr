import { useSelector } from "react-redux";
import { useState } from "react";
import { getLatestData } from "../../../../utils/utils";
import {
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";

export const AssignedWorkerTable = ({ projectId }) => {
  const data = useSelector((state) => state.v2_overview.content);
  const studies = data.studies.filter((item) => item.project_seq === projectId);

  if (!studies || studies.length === 0)
    return (
      <p style={{ padding: "10px", fontSize: "2rem" }}>해당 프로젝트에 등록된 멤버가 없습니다!</p>
    );

  const latestData = getLatestData(studies);
  const members = [...new Set(latestData.map((item) => item.m_seq))].map((id) => {
    //해당 프로젝트에 참석하는 멤버
    const member = latestData.find((member) => member.m_seq === id); //멤버 정보 찾기기
    const prj = [
      ...new Set(latestData.filter((item) => item.m_seq === id).map((item) => item.project_seq)),
    ].map((project_seq) => {
      return data.projects.find((item) => item.project_seq === project_seq).title;
    }); // 해당 작업자에 대해 다른 프로젝트를 담당하고 있는지 확인

    return {
      name: member.manager,
      email: member.email,
      project: prj.join(", "),
    };
  });

  const tableData = members.map((item) => {
    return {
      Name: item.name,
      Email: item.email,
      Project: item.project ? item.project : "N/A",
    };
  });

  const columnHelper = createColumnHelper();

  const columns = [
    columnHelper.accessor("", {
      id: "checkbox",
      header: "",
      cell: <input type="checkbox" />,
    }),
    columnHelper.accessor("Name", {
      id: "name",
      header: "Name",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("Email", {
      id: "email",
      header: "Email",
      cell: (info) => info.getValue(),
    }),
    columnHelper.accessor("Project", {
      id: "project",
      header: "Project",
      cell: (info) => info.getValue(),
    }),
  ];

  const [tblData, setTblData] = useState(tableData);

  const tbl = useReactTable({
    data: tblData,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div id="assigned-worker-table">
      <div className="assigned-worker-button-area">
        <div className="left-btn">
          <button type="button" className="deselect-all-btn">
            Deselect all
          </button>
          <button type="button" className="select-all-btn">
            Select all
          </button>
        </div>

        <div className="right-btn">
          <button type="button" className="add-users-btn">
            Add Users
          </button>
          <button type="button" className="execute-users-btn">
            Execute Users
          </button>
        </div>
      </div>
      <table>
        <thead>
          {tbl.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id}>
              {headerGroup.headers.map((header) => (
                <th key={header.id}>
                  {header.isPlaceholder
                    ? null
                    : flexRender(header.column.columnDef.header, header.getContext())}
                </th>
              ))}
            </tr>
          ))}
        </thead>
        <tbody>
          {tbl.getRowModel().rows.map((row) => (
            <tr key={row.id}>
              {row.getVisibleCells().map((cell) => (
                <td key={cell.id}>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
