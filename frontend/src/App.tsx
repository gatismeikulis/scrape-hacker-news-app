import { useEffect, useState } from "react";
import { useQueryScrapedHackerNews } from "./lib/useQueryScrapedHackerNews";
import { ArticlesTable } from "./components/ArticlesTable";
import { ScrapingBlock } from "./components/ScrapingBlock";
import { Pagination } from "./components/Pagination";
import "./App.css";
import { Spinner } from "./components/Spinner";

export function App() {
  const [page, setPage] = useState(1);
  const { data, status } = useQueryScrapedHackerNews(page);

  // Sync local current page state with server's current page in case of mismatch
  useEffect(() => {
    if (data?.pagination?.page) {
      setPage(data.pagination.page);
    }
  }, [data?.pagination?.page]);

  if (status === "pending") {
    return <Spinner />;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <div className="app-container">
      <div className="app-header">
        <h1 className="app-title">Scraped Hacker News</h1>
        <ScrapingBlock />
      </div>
      <div className="section">
        <ArticlesTable data={data.articles} />
        <Pagination
          currentPage={page}
          totalPages={data.pagination.pages}
          onPageChange={setPage}
        />
      </div>
    </div>
  );
}
