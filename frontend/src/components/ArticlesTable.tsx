import DataTable from "datatables.net-react";
import DT, { type Config, type ConfigColumns } from "datatables.net-dt";
import "datatables.net-dt/css/dataTables.dataTables.css";
import "./ArticlesTable.css";
import type { Article } from "../lib/types";

type ArticlesTableProps = {
  data: Article[];
};

export function ArticlesTable({ data }: ArticlesTableProps) {
  DataTable.use(DT);

  const dateFormatter = new Intl.DateTimeFormat(undefined, {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  });

  const columns: ConfigColumns[] = [
    { data: "title", title: "Title", name: "title", width: "50%" },
    { data: "id", title: "ID" },
    { data: "points", title: "Points" },
    { data: "link", title: "Link", name: "link" },
    { data: "date_created", title: "Date Created", name: "date_created" },
    { data: "scraped_at", title: "Scraped At", name: "scraped_at" },
  ];

  const options: Config = {
    ordering: false,
    paging: false,
    info: false,
    searching: false,
    scrollY: "60vh",
  };

  return (
    <div className="table-container section">
      <DataTable
        data={data}
        columns={columns}
        options={options}
        className="articles-table"
        slots={{
          title: (data: string) => (
            <span className="article-title">{data}</span>
          ),
          link: (data: string) => (
            <a
              className="article-link"
              href={data}
              target="_blank"
              rel="noopener noreferrer"
            >
              Open
            </a>
          ),
          date_created: (data: string) => (
            <span className="article-date-created">
              {dateFormatter.format(new Date(data))}
            </span>
          ),
          scraped_at: (data: string) => (
            <span className="article-scraped-at">
              {dateFormatter.format(new Date(data))}
            </span>
          ),
        }}
      />
    </div>
  );
}
