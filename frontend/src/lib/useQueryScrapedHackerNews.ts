import { keepPreviousData, useQuery } from "@tanstack/react-query";
import type { Article, Pagination } from "./types";
import { SCRAPE_HACKER_NEWS_API_BASE_URL } from "./constants";

export function useQueryScrapedHackerNews(page: number) {
  return useQuery({
    queryKey: ["scrape-hacker-news", page],
    queryFn: () => fetchArticles(page),
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    placeholderData: keepPreviousData, // keep the previous data when the page changes
  });
}

async function fetchArticles(
  page: number,
): Promise<{ articles: Article[]; pagination: Pagination }> {
  const response = await fetch(
    `${SCRAPE_HACKER_NEWS_API_BASE_URL}/articles?page=${page}`,
  );
  if (!response.ok) {
    throw new Error(`Network response was not ok, ${response.statusText}`);
  }

  // consider using zod to validate response
  const jsonData: unknown = await response.json();

  return jsonData as { articles: Article[]; pagination: Pagination };
}
