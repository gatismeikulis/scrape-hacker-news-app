import { useState } from "react";
import type { ScrapingParams } from "../lib/types";
import { useMutationScrapeHackerNews } from "../lib/useMutationScrapeHackerNews";
import "./ScrapingBlock.css";

export function ScrapingBlock() {
  const [scrapingParams, setScrapingParams] = useState<ScrapingParams>({
    start_page: 1,
    page_count: 1,
  });
  const { mutate: scrapeHackerNews, isPending } =
    useMutationScrapeHackerNews(scrapingParams);

  return (
    <div className="scraping">
      <button
        className="scraping-button"
        onClick={() => scrapeHackerNews()}
        disabled={isPending}
      >
        {isPending ? "Scraping..." : "Scrape"}
      </button>
      <label>
        Start page
        <input
          type="number"
          min={1}
          step={1}
          value={scrapingParams.start_page}
          onChange={(e) =>
            setScrapingParams({
              ...scrapingParams,
              start_page: Math.max(1, parseInt(e.target.value || "1", 10)),
            })
          }
        />
      </label>
      <label>
        Pages
        <input
          type="number"
          min={1}
          max={10}
          step={1}
          value={scrapingParams.page_count}
          onChange={(e) =>
            setScrapingParams({
              ...scrapingParams,
              page_count: Math.min(
                10,
                Math.max(1, parseInt(e.target.value || "1", 10)),
              ),
            })
          }
        />
      </label>
    </div>
  );
}
