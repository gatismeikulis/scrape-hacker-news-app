import { useState } from "react";
import { useQueryScrapedHackerNews } from "./lib/useQueryScrapedHackerNews";
import "./App.css";
import { useMutationScrapeHackerNews } from "./lib/useMutationScrapeHackerNews";
import type { ScrapingParams } from "./lib/types";

export function App() {
  const [page, setPage] = useState(1);
  const [scrapingParams, setScrapingParams] = useState<ScrapingParams>({
    start_page: 1,
    page_count: 1,
  });
  const { data, status } = useQueryScrapedHackerNews(page);
  const { mutate: scrapeHackerNews } =
    useMutationScrapeHackerNews(scrapingParams);

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  return (
    <div className="demo-text">
      {data.articles.map((article) => (
        <div key={article.id}>
          <p>
            {article.title} - {article.points}
          </p>
        </div>
      ))}
      <button onClick={() => setPage(page + 1)}>Next Page</button>
      <p>Page: {page}</p>
      <p>Page v2: {data.pagination.page}</p>
      <p>Total Pages: {data.pagination.pages}</p>
      <p>Total Articles: {data.pagination.total}</p>
      <p>Per Page: {data.pagination.per_page}</p>
      <button onClick={() => setPage(page - 1)}>Previous Page</button>
      <button onClick={() => scrapeHackerNews()}>Scrape Hacker News</button>
      <input
        type="number"
        value={scrapingParams.start_page}
        onChange={(e) =>
          setScrapingParams({
            ...scrapingParams,
            start_page: parseInt(e.target.value),
          })
        }
      />
      <input
        type="number"
        value={scrapingParams.page_count}
        onChange={(e) =>
          setScrapingParams({
            ...scrapingParams,
            page_count: parseInt(e.target.value),
          })
        }
      />
    </div>
  );
}
