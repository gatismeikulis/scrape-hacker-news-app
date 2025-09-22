import { useState } from "react";
import type { ScrapingParams } from "../lib/types";
import { useMutationScrapeHackerNews } from "../lib/useMutationScrapeHackerNews";

export function ScrapingBlock() {
  const [scrapingParams, setScrapingParams] = useState<ScrapingParams>({
    start_page: 1,
    page_count: 1,
  });
  const { mutate: scrapeHackerNews } =
    useMutationScrapeHackerNews(scrapingParams);

  return (
    <>
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
    </>
  );
}
