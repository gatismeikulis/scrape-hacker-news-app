from pathlib import Path
from bs4 import BeautifulSoup

from app.hacker_news_scraper import extract_and_normalize_article_info


class TestExtractAndNormalizeArticleInfo:

    def test_extracts_correct_article_info(self):
        sample_path = Path(__file__).with_name("news-ycombinator-com-page-sample.html")
        html = sample_path.read_text(encoding="utf-8")
        soup = BeautifulSoup(html, "html.parser")

        article_row = soup.findAll("tr", class_="athing submission")
        article_info = extract_and_normalize_article_info(article_row[0])
        assert article_info is not None
        assert article_info.id == "45331370"
        assert article_info.title == "Kmart's use of facial recognition to tackle refund fraud unlawful"
        assert (
            article_info.link
            == "https://www.oaic.gov.au/news/media-centre/18-kmarts-use-of-facial-recognition-to-tackle-refund-fraud-unlawful,-privacy-commissioner-finds"
        )
