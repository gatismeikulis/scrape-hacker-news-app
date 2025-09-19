from datetime import datetime
from .database import get_session
from .models import Article
from .hacker_news_scraper import ArticleInfo


def save_articles(article_infos: list[ArticleInfo]) -> None:
    """Save articles to database using merge"""

    with get_session() as session:
        for article_info in article_infos:
            article = Article(
                id=article_info.id,
                title=article_info.title,
                link=article_info.link,
                points=article_info.points,
                date_created=datetime.fromisoformat(article_info.date_created),
                scraped_at=datetime.now(),
            )
            _ = session.merge(article)  # insert or update

    return None
