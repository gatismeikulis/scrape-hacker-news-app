import DataTable from "datatables.net-react";
import DT, { type ConfigColumns, type Config } from "datatables.net-dt"; // default theme
import "./DataTableWrapper.css";

// consider using generics to sync the data and the columns
type DataTableWrapperProps = {
  data: any[];
  columns: ConfigColumns[];
};

export function DataTableWrapper({ data, columns }: DataTableWrapperProps) {
  DataTable.use(DT);

  const options: Config = {
    ordering: false,
    paging: false,
    info: false,
    searching: false,
  };

  return <DataTable data={data} columns={columns} options={options} />;
}
