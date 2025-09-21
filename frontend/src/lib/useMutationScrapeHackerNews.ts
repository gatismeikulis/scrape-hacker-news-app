import { useMutation, useQueryClient } from "@tanstack/react-query";
import { SCRAPE_HACKER_NEWS_API_BASE_URL } from "./constants";
import type { ScrapingParams } from "./types";

export function useMutationScrapeHackerNews(params: ScrapingParams) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => scrapeHackerNews(params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["scrape-hacker-news"] });
    },
  });
}

async function scrapeHackerNews(params: ScrapingParams) {
  const response = await fetch(`${SCRAPE_HACKER_NEWS_API_BASE_URL}/scrape`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(params),
  });

  if (!response.ok) {
    throw new Error(`Network response was not ok, ${response.statusText}`);
  }

  return response.json();
}
