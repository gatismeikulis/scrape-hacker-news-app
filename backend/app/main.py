import click
from flask import Flask, jsonify, request
from .models import Article
from .hacker_news_scraper import scrape_hacker_news
from .save_articles import save_articles
from .database import get_session, initialize_database


def create_app():
    app = Flask(__name__)

    initialize_database()

    @app.get("/")
    def get_root():
        return """
        <h1>Hacker News Scraper API</h1>
        <h2>API Usage</h2>
        <p>Use <code>/scrape</code> POST request with optional 'start_page' and 'page_count' parameters to scrape articles</p>
        <p>Use <code>/articles</code> GET request to retrieve all scraped and saved articles</p>
        """

    @app.get("/articles")
    def get_articles():
        with get_session() as session:
            articles = session.query(Article).all()
            return jsonify(
                {
                    "articles": [
                        {
                            "id": article.id,
                            "title": article.title,
                            "link": article.link,
                            "points": article.points,
                            "date_created": article.date_created.isoformat(),
                            "scraped_at": article.scraped_at.isoformat(),
                        }
                        for article in articles
                    ]
                }
            )

    @app.post("/scrape")
    def scrape_articles():

        try:
            # Get parameters from request body
            data = request.get_json() or {}
            start_page = int(data.get("start_page", 1))
            page_count = int(data.get("page_count", 1))

            # Scrape articles
            articles = scrape_hacker_news(starting_page=start_page, page_count=page_count)
            _ = save_articles(articles)

            return jsonify(
                {
                    "message": "Scraping completed",
                    "start_page": start_page,
                    "pages_scraped": page_count,
                    "article_count": len(articles),
                }
            )

        except Exception as e:
            return jsonify({"error": str(e)}), 500

    @app.cli.command("scrape")
    @click.option("--start", default=1, help="Starting page number")
    @click.option("--count", default=1, help="Number of pages to scrape")
    def scrape_command(start: int, count: int):

        try:
            articles = scrape_hacker_news(starting_page=start, page_count=count)
            _ = save_articles(articles)

        except Exception as e:
            print(f"❌ Error: {e}")

    return app


app = create_app()
