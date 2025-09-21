import { useState } from "react";
import { useQueryScrapedHackerNews } from "./lib/useQueryScrapedHackerNews";
import "./App.css";

export function App() {
  const [page, setPage] = useState(1);
  const { data, status } = useQueryScrapedHackerNews(page);

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
      <button onClick={() => setPage(page - 1)}>Previous Page</button>
    </div>
  );
}
