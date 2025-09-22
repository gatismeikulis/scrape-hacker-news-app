import { useEffect, useState } from "react";
import { useQueryScrapedHackerNews } from "./lib/useQueryScrapedHackerNews";
import { DataTableWrapper } from "./components/DataTableWrapper";
import { ScrapingBlock } from "./components/ScrapingBlock";
import { Pagination } from "./components/Pagination";
import "./App.css";

export function App() {
  const [page, setPage] = useState(1);
  const { data, status } = useQueryScrapedHackerNews(page);

  // Sync local current page state with server's current page
  useEffect(() => {
    if (data?.pagination?.page && data.pagination.page !== page) {
      setPage(data.pagination.page);
    }
  }, [data?.pagination?.page, page]);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  const columns = [
    { data: "title", title: "Title" },
    { data: "id", title: "ID" },
    { data: "points", title: "Points" },
    { data: "link", title: "Link" },
    { data: "date_created", title: "Date Created" },
    { data: "scraped_at", title: "Scraped At" },
  ];

  return (
    <div className="demo-text">
      <h1>Scraped Hacker News</h1>
      <DataTableWrapper data={data.articles} columns={columns} />
      <Pagination
        currentPage={page}
        totalPages={data.pagination.pages}
        onPageChange={setPage}
      />
      <ScrapingBlock />
    </div>
  );
}
