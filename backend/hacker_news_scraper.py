from dataclasses import dataclass
from datetime import datetime
import time
from bs4 import BeautifulSoup, ResultSet, Tag
import requests
import logging

BASE_URL = "https://news.ycombinator.com"
CRAWL_DELAY = 30
MAX_PAGE_COUNT = 20

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ScrapingError(Exception):
    pass


@dataclass
class ArticleInfo:
    id: str
    title: str
    link: str
    points: int | None
    date_created: str


def scrape_page(page_number: int) -> BeautifulSoup:
    url = f"{BASE_URL}/?p={page_number}"
    headers = {"User-Agent": "Mozilla/5.0"}

    try:
        response = requests.get(url, headers)
        response.raise_for_status()
        soup = BeautifulSoup(response.content, "html.parser")
    except Exception as e:
        raise ScrapingError(f"Failed to fetch page {page_number}: {e}")

    return soup


def extract_and_normalize_article_info(article_title_row: Tag) -> ArticleInfo | None:

    try:
        # each article has a unique id stored in the 'id' attribute
        id = article_title_row.get("id")
        if not isinstance(id, str):
            raise ScrapingError(f"Article ID not found")

        # span with class 'titleline' contains the actual title and link to the article
        title_line_span = article_title_row.find("span", class_="titleline")
        if not isinstance(title_line_span, Tag):
            raise ScrapingError(f"Span with class 'titleline' for article {id} not found")

        # inside 'title_line_span' there is an 'a' tag that contains the title and the link to the article
        title_and_link = title_line_span.find("a")
        if not isinstance(title_and_link, Tag):
            raise ScrapingError(f"Tag containing link and title information for article {id} not found")

        # link is the value of the 'href' attribute of the 'a' tag
        raw_link = title_and_link.get("href", "")
        if not isinstance(raw_link, str):
            raise ScrapingError(f"Article's link for article {id} not found")

        link = raw_link
        if raw_link.startswith("item?id="):
            link = f"{BASE_URL}/{raw_link}"

        # title is the actual text of the 'a' tag
        title = title_and_link.get_text(strip=True)
        if title == "":
            raise ScrapingError(f"Article's title for article {id} is empty")

        # points and creation-date are in the next row after the title and link row
        points_and_date_row = article_title_row.find_next_sibling("tr")
        if not isinstance(points_and_date_row, Tag):
            raise ScrapingError(f"Points and date row for article {id} not found")

        # if points exist, they are in the span with the id 'score_{article_id}'
        points_span = points_and_date_row.find("span", id=f"score_{id}")

        points = None
        if points_span is not None:
            # points are the text of the 'span' tag but it's in a format like '123 points'
            raw_points = points_span.get_text(strip=True).split(" ")[0]
            points = int(raw_points)

        # date-created is in the span with the class 'age'
        date_created_span = points_and_date_row.find("span", class_="age")
        if not isinstance(date_created_span, Tag):
            raise ScrapingError(f"Date created span for article {id} not found")

        # date-created is value of the 'title' attribute of the 'span' tag in format '2025-09-18T15:47:40 1758210460'
        raw_date_created = date_created_span.get("title", "")
        if not isinstance(raw_date_created, str):
            raise ScrapingError(f"Date created for article {id} not found")

        date_created_timestamp = raw_date_created.split(" ")[1]
        date_created = datetime.fromtimestamp(int(date_created_timestamp)).isoformat()

        return ArticleInfo(
            id=id,
            title=title,
            link=link,
            points=points,
            date_created=date_created,
        )

    except Exception as e:
        print(f"Error extracting article info: {e}")
        return None


def scrape_hacker_news(starting_page: int = 1, page_count: int = 1) -> list[ArticleInfo]:
    if starting_page < 1:
        raise ScrapingError("Starting page must be greater than 0")
    if page_count < 1 and page_count > MAX_PAGE_COUNT:
        raise ScrapingError(f"Page count must be greater than 0 and less than {MAX_PAGE_COUNT}")

    article_infos: list[ArticleInfo] = []

    logger.info(f"Scraping {page_count} pages from {BASE_URL} starting from page {starting_page}...")

    end_page = starting_page + page_count

    for page_number in range(starting_page, end_page):
        soup = scrape_page(page_number)
        # every article has a title row as a table row (tr) with the class 'athing submission'
        article_title_rows: ResultSet[Tag] = soup.find_all("tr", class_="athing submission")

        if len(article_title_rows) == 0:
            logger.info(f"No articles found on page {page_number}")
            break

        for article_title_row in article_title_rows:
            article_info = extract_and_normalize_article_info(article_title_row)
            if article_info is not None:
                article_infos.append(article_info)
        logger.info(f"Page {page_number} scraped successfully, found {len(article_infos)} articles so far")
        if page_number < end_page - 1:
            time.sleep(CRAWL_DELAY)  # https://news.ycombinator.com/robots.txt -> Crawl-delay: 30

    logger.info(f"Scraping completed. Found {len(article_infos)} articles.")

    return article_infos


if __name__ == "__main__":
    results = scrape_hacker_news(10, page_count=2)
    for r in results:
        print(f"{r.link[:20]}... | {r.points} points | created at {r.date_created}")
