import DataTable from "datatables.net-react";
import DT, { type ConfigColumns } from "datatables.net-dt"; // default theme

type DataTableWrapperProps = {
  data: any[];
  columns: ConfigColumns[];
};

export function DataTableWrapper({ data, columns }: DataTableWrapperProps) {
  DataTable.use(DT);

  return (
    <DataTable data={data} columns={columns} className="">
      <thead>
        <tr>
          <th>Name</th>
          <th>Position</th>
          <th>Office</th>
          <th>Extn.</th>
          <th>Start date</th>
          <th>Salary</th>
        </tr>
      </thead>
    </DataTable>
  );
}
