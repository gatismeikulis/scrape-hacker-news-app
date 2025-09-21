import { useQuery } from "@tanstack/react-query";
import "./App.css";
import { useState } from "react";

async function fetchArticles(page: number) {
  const response = await fetch(
    `http://localhost:5000/api/articles?page=${page}`,
  );
  if (!response.ok) {
    throw new Error("Network response was not ok");
  }
  const jsonData: unknown = await response.json();
  // consider using zod to validate response

  return jsonData;
}

export function App() {
  const [page, setPage] = useState(1);
  console.log(page);

  const { data, status } = useQuery({
    queryKey: ["scrape-hacker-news", page],
    queryFn: () => fetchArticles(page),
  });

  if (status === "pending") {
    return <div>Loading...</div>;
  }

  if (status === "error") {
    return <div>Error</div>;
  }

  console.log(data);

  return (
    <div className="demo-text">
      CLEAN VITE REACT APP
      <button onClick={() => setPage(page + 1)}>Next Page</button>
      <button onClick={() => setPage(page - 1)}>Previous Page</button>
    </div>
  );
}
