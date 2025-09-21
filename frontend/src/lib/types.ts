export type Article = {
  id: string;
  title: string;
  link: string;
  points: number | null;
  date_created: string;
  scraped_at: string;
};

export type Pagination = {
  page: number;
  per_page: number;
  total: number;
  pages: number;
};

export type ScrapingParams = {
  start_page: number;
  page_count: number;
};
