"""
Content Discovery Module
Discovers new content from various sources (RSS feeds, websites, APIs)
"""

import requests
import feedparser
from bs4 import BeautifulSoup
from typing import List, Dict, Optional
from datetime import datetime
from urllib.parse import urljoin, urlparse
import hashlib
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ContentItem:
    """Represents a discovered content item"""
    
    def __init__(self, title: str, url: str, description: str = "", 
                 published_date: Optional[datetime] = None, source: str = ""):
        self.title = title
        self.url = url
        self.description = description
        self.published_date = published_date or datetime.now()
        self.source = source
        self.content_hash = self._generate_hash()
    
    def _generate_hash(self) -> str:
        """Generate a unique hash for this content item"""
        content = f"{self.url}{self.title}"
        return hashlib.md5(content.encode()).hexdigest()
    
    def to_dict(self) -> Dict:
        """Convert to dictionary"""
        return {
            "title": self.title,
            "url": self.url,
            "description": self.description,
            "published_date": self.published_date.isoformat() if self.published_date else None,
            "source": self.source,
            "content_hash": self.content_hash
        }


class ContentDiscovery:
    """Discovers content from various sources"""
    
    def __init__(self):
        self.session = requests.Session()
        self.session.headers.update({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"
        })
    
    def discover_from_rss(self, feed_url: str, max_items: int = 10) -> List[ContentItem]:
        """Discover content from RSS/Atom feeds"""
        try:
            feed = feedparser.parse(feed_url)
            items = []
            
            # Check for feedparser errors (like 404, connection issues)
            if feed.bozo and feed.bozo_exception:
                error_msg = str(feed.bozo_exception)
                logger.error(f"Error parsing RSS feed {feed_url}: {error_msg}")
                # Check if it's a 404 or other HTTP error
                if "404" in error_msg or "Not Found" in error_msg:
                    logger.error(f"Feed not found (404): {feed_url}. Try checking the URL or use atom.xml instead of /feed/")
                return []
            
            # Check if feed has entries
            if not hasattr(feed, 'entries') or len(feed.entries) == 0:
                logger.warning(f"RSS feed {feed_url} returned no entries")
                return []
            
            for entry in feed.entries[:max_items]:
                try:
                    title = entry.get("title", "")
                    link = entry.get("link", "")
                    description = entry.get("description", "") or entry.get("summary", "")
                    
                    # Parse published date
                    published_date = None
                    if hasattr(entry, "published_parsed") and entry.published_parsed:
                        published_date = datetime(*entry.published_parsed[:6])
                    
                    if title and link:
                        items.append(ContentItem(
                            title=title,
                            url=link,
                            description=description,
                            published_date=published_date,
                            source=feed_url
                        ))
                except Exception as e:
                    logger.warning(f"Error parsing RSS entry: {e}")
                    continue
            
            logger.info(f"Discovered {len(items)} items from RSS feed: {feed_url}")
            return items
        
        except Exception as e:
            logger.error(f"Error parsing RSS feed {feed_url}: {e}")
            return []
    
    def discover_from_website(self, url: str, selector: str = "article", max_items: int = 10) -> List[ContentItem]:
        """Discover content from a website by scraping"""
        try:
            response = self.session.get(url, timeout=10)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            articles = soup.select(selector)[:max_items]
            
            items = []
            for article in articles:
                try:
                    # Try to extract title
                    title_elem = article.select_one("h1, h2, h3, .title, [class*='title']")
                    title = title_elem.get_text(strip=True) if title_elem else ""
                    
                    # Try to extract link
                    link_elem = article.select_one("a")
                    link = link_elem.get("href", "") if link_elem else ""
                    if link and not link.startswith("http"):
                        link = urljoin(url, link)
                    
                    # Try to extract description
                    desc_elem = article.select_one("p, .description, [class*='summary']")
                    description = desc_elem.get_text(strip=True)[:500] if desc_elem else ""
                    
                    if title and link:
                        items.append(ContentItem(
                            title=title,
                            url=link,
                            description=description,
                            source=url
                        ))
                except Exception as e:
                    logger.warning(f"Error parsing article: {e}")
                    continue
            
            logger.info(f"Discovered {len(items)} items from website: {url}")
            return items
        
        except Exception as e:
            logger.error(f"Error scraping website {url}: {e}")
            return []
    
    def discover_from_sources(self, sources: List[str], max_items_per_source: int = 10) -> List[ContentItem]:
        """Discover content from multiple sources"""
        all_items = []
        seen_hashes = set()
        
        for source in sources:
            try:
                # Check if it's an RSS feed
                if any(source.endswith(ext) for ext in [".rss", ".xml", ".atom", "/feed", "/rss"]):
                    items = self.discover_from_rss(source, max_items_per_source)
                else:
                    # Assume it's a website
                    items = self.discover_from_website(source, max_items=max_items_per_source)
                
                # Deduplicate
                for item in items:
                    if item.content_hash not in seen_hashes:
                        seen_hashes.add(item.content_hash)
                        all_items.append(item)
            
            except Exception as e:
                logger.error(f"Error processing source {source}: {e}")
                continue
        
        logger.info(f"Total unique items discovered: {len(all_items)}")
        return all_items
    
    def fetch_full_content(self, content_item: ContentItem) -> str:
        """Fetch the full content of a URL"""
        try:
            response = self.session.get(content_item.url, timeout=15)
            response.raise_for_status()
            
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove script and style elements
            for script in soup(["script", "style", "nav", "footer", "header"]):
                script.decompose()
            
            # Try to find main content
            main_content = soup.find("main") or soup.find("article") or soup.find("body")
            
            if main_content:
                # Extract text
                text = main_content.get_text(separator="\n", strip=True)
                # Clean up excessive whitespace
                lines = [line.strip() for line in text.split("\n") if line.strip()]
                return "\n".join(lines)
            
            return soup.get_text(separator="\n", strip=True)
        
        except Exception as e:
            logger.error(f"Error fetching content from {content_item.url}: {e}")
            return ""

