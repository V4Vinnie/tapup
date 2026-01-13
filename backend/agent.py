"""
Main Agent Orchestrator
Coordinates content discovery, filtering, processing, and microlearning generation
"""

import logging
from typing import List, Optional, Dict
from datetime import datetime

from content_discovery import ContentDiscovery, ContentItem
from content_filter import ContentFilter
from content_processor import ContentProcessor
from microlearning_generator import MicrolearningGenerator
from storage import ContentStorage

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ContentScreeningAgent:
    """Main agent that screens for new content and creates microlearnings"""
    
    def __init__(self, target_skill: str, sources: List[str], 
                 storage_dir: str = "storage",
                 api_key: Optional[str] = None):
        """
        Initialize the content screening agent.
        
        Args:
            target_skill: The skill to screen content for (e.g., "Python Programming")
            sources: List of content sources (RSS feeds, websites)
            storage_dir: Directory for storing processed content and microlearnings
            api_key: OpenAI API key (if not provided, will use OPENAI_API_KEY env var)
        """
        self.target_skill = target_skill
        self.sources = sources
        self.api_key = api_key
        
        # Initialize components
        self.discovery = ContentDiscovery()
        self.filter = ContentFilter(target_skill=target_skill, api_key=api_key)
        self.processor = ContentProcessor(api_key=api_key)
        self.generator = MicrolearningGenerator(target_skill=target_skill, api_key=api_key)
        self.storage = ContentStorage(storage_dir=storage_dir)
        
        logger.info(f"Initialized ContentScreeningAgent for skill: {target_skill}")
        logger.info(f"Monitoring {len(sources)} sources")
    
    def screen_and_create_microlearnings(self, max_items_per_source: int = 10) -> Dict:
        """
        Screen for new content and create microlearnings.
        
        Args:
            max_items_per_source: Maximum items to process per source
        
        Returns:
            Dictionary with screening results and created microlearnings
        """
        logger.info("Starting content screening...")
        results = {
            "screened_at": datetime.now().isoformat(),
            "target_skill": self.target_skill,
            "sources": self.sources,
            "discovered": 0,
            "processed": 0,
            "filtered_out": 0,
            "already_processed": 0,
            "microlearnings_created": 0,
            "errors": [],
            "microlearnings": []
        }
        
        try:
            # Step 1: Discover content from all sources
            logger.info("Step 1: Discovering content from sources...")
            discovered_items = self.discovery.discover_from_sources(
                self.sources, 
                max_items_per_source=max_items_per_source
            )
            results["discovered"] = len(discovered_items)
            logger.info(f"Discovered {len(discovered_items)} items")
            
            # Step 2: Filter out already processed content
            new_items = []
            for item in discovered_items:
                if self.storage.is_processed(item.content_hash):
                    results["already_processed"] += 1
                    logger.debug(f"Already processed: {item.title[:50]}...")
                else:
                    new_items.append(item)
            
            logger.info(f"Found {len(new_items)} new items to process")
            
            # Step 3: Fetch full content for new items
            logger.info("Step 2: Fetching full content...")
            full_contents = {}
            items_with_content = []
            
            for item in new_items:
                try:
                    full_content = self.discovery.fetch_full_content(item)
                    if full_content and len(full_content) > 100:  # Minimum content length
                        full_contents[item.content_hash] = full_content
                        items_with_content.append(item)
                    else:
                        logger.warning(f"Insufficient content for: {item.title[:50]}...")
                        results["errors"].append(f"Insufficient content: {item.title}")
                except Exception as e:
                    logger.error(f"Error fetching content for {item.url}: {e}")
                    results["errors"].append(f"Error fetching {item.url}: {str(e)}")
            
            logger.info(f"Fetched content for {len(items_with_content)} items")
            
            # Step 4: Filter for relevance
            logger.info("Step 3: Filtering for relevance...")
            relevant_items = self.filter.filter_content(items_with_content, full_contents)
            results["filtered_out"] = len(items_with_content) - len(relevant_items)
            logger.info(f"Found {len(relevant_items)} relevant items")
            
            # Step 5: Create microlearnings
            logger.info("Step 4: Creating microlearnings...")
            for item in relevant_items:
                try:
                    full_content = full_contents[item.content_hash]
                    
                    # Generate microlearning
                    microlearning = self.generator.create_microlearning(
                        title=item.title,
                        content=full_content,
                        url=item.url,
                        description=item.description
                    )
                    
                    # Save microlearning
                    filepath = self.storage.save_microlearning(
                        item.content_hash,
                        microlearning
                    )
                    
                    # Mark as processed
                    self.storage.mark_as_processed(item.content_hash)
                    
                    results["microlearnings_created"] += 1
                    results["microlearnings"].append({
                        "title": item.title,
                        "url": item.url,
                        "filepath": filepath,
                        "content_hash": item.content_hash
                    })
                    
                    logger.info(f"Created microlearning: {item.title[:50]}...")
                    results["processed"] += 1
                
                except Exception as e:
                    logger.error(f"Error creating microlearning for {item.url}: {e}")
                    results["errors"].append(f"Error processing {item.url}: {str(e)}")
            
            logger.info(f"Screening complete! Created {results['microlearnings_created']} microlearnings")
            return results
        
        except Exception as e:
            logger.error(f"Error in screening process: {e}")
            results["errors"].append(f"Fatal error: {str(e)}")
            return results
    
    def get_microlearnings(self) -> List[Dict]:
        """Get all created microlearnings"""
        # This would typically read from storage
        # For now, return basic info
        import json
        from pathlib import Path
        
        microlearnings = []
        microlearnings_dir = Path(self.storage.microlearnings_dir)
        
        if microlearnings_dir.exists():
            for filepath in microlearnings_dir.glob("*.json"):
                try:
                    with open(filepath, "r") as f:
                        microlearning = json.load(f)
                        microlearnings.append(microlearning)
                except Exception as e:
                    logger.error(f"Error reading microlearning {filepath}: {e}")
        
        return microlearnings
    
    def run_continuously(self, check_interval_hours: int = 6):
        """Run the agent continuously, checking for new content at intervals"""
        import schedule
        import time
        
        logger.info(f"Starting continuous screening (every {check_interval_hours} hours)")
        logger.info("Press Ctrl+C to stop")
        
        # Schedule the screening
        schedule.every(check_interval_hours).hours.do(
            self.screen_and_create_microlearnings
        )
        
        # Run once immediately
        self.screen_and_create_microlearnings()
        
        # Run scheduled tasks
        try:
            while True:
                schedule.run_pending()
                time.sleep(60)  # Check every minute
        except KeyboardInterrupt:
            logger.info("Stopping continuous screening...")
    
    def preview_content(self, max_items: int = 5) -> List[Dict]:
        """Preview discovered content without processing"""
        logger.info("Previewing content...")
        discovered_items = self.discovery.discover_from_sources(
            self.sources,
            max_items_per_source=max_items
        )
        
        preview = []
        for item in discovered_items[:max_items]:
            preview.append(item.to_dict())
        
        return preview

