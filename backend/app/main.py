import click
from flask_cors import CORS
from flask import Flask, jsonify, request
from .models import Article
from .hacker_news_scraper import scrape_hacker_news
from .save_articles import save_articles
from .database import get_session, initialize_database

ARTICLES_PER_PAGE = 10


def create_app():
    app = Flask(__name__)

    _ = CORS(app, resources={r"/api/*": {"origins": "http://localhost:5173"}})

    initialize_database()

    @app.get("/")
    def get_root():
        return """
        <h1>Hacker News Scraper API</h1>
        <h2>API Usage</h2>
        <p>Use <code>/api/scrape</code> POST request with optional 'start_page' and 'page_count' parameters to scrape articles</p>
        <p>Use <code>/api/articles</code> GET request with optional 'page' query parameter to retrieve scraped and saved articles</p>
        """

    @app.get("/api/articles")
    def get_articles():
        # get 'page' query parameter
        page = int(request.args.get("page", 1))

        if page < 1:
            page = 1

        with get_session() as session:
            total = session.query(Article).count()

            articles = (
                session.query(Article)
                .order_by(Article.date_created.desc())
                .offset((page - 1) * ARTICLES_PER_PAGE)
                .limit(ARTICLES_PER_PAGE)
                .all()
            )

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
                    ],
                    "pagination": {
                        "page": page,
                        "per_page": ARTICLES_PER_PAGE,
                        "total": total,
                        "pages": (total + ARTICLES_PER_PAGE - 1) // ARTICLES_PER_PAGE,
                    },
                }
            )

    @app.post("/api/scrape")
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
