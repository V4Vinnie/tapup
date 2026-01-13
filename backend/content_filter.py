"""
Content Filter Module
Filters content for relevance to target skills using AI
"""

import os
from typing import List, Optional
import google.generativeai as genai
from dotenv import load_dotenv
import logging

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ContentFilter:
    """Filters content based on relevance to target skills"""
    
    def __init__(self, target_skill: str, api_key: Optional[str] = None):
        self.target_skill = target_skill
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY in .env file")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
    
    def is_relevant(self, title: str, description: str, full_content: str = "") -> bool:
        """Check if content is relevant to the target skill"""
        try:
            # Use the first part of content for efficiency
            content_preview = full_content[:2000] if full_content else description
            
            prompt = f"""You are a helpful content curation assistant. Be concise.

You are a content curator for learning purposes.

Target Skill: {self.target_skill}

Content Title: {title}
Content Description: {description}
Content Preview: {content_preview[:500] if content_preview else "N/A"}

Is this content relevant to learning about "{self.target_skill}"? 
Respond with only "YES" or "NO" followed by a brief explanation (one sentence).

Format: YES/NO - explanation"""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 100,
                    "temperature": 0.3,
                }
            )
            
            result = response.text.strip().upper()
            is_relevant = result.startswith("YES")
            
            logger.info(f"Content '{title[:50]}...' relevance: {is_relevant}")
            return is_relevant
        
        except Exception as e:
            logger.error(f"Error checking relevance: {e}")
            # Default to relevant if there's an error to avoid missing content
            return True
    
    def filter_content(self, content_items: List, full_contents: dict) -> List:
        """Filter a list of content items for relevance"""
        relevant_items = []
        
        for item in content_items:
            full_content = full_contents.get(item.content_hash, "")
            if self.is_relevant(item.title, item.description, full_content):
                relevant_items.append(item)
        
        logger.info(f"Filtered {len(content_items)} items to {len(relevant_items)} relevant items")
        return relevant_items

