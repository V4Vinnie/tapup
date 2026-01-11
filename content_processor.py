"""
Content Processor Module
Processes and summarizes content for microlearning generation
"""

import os
from typing import Dict, Optional, List
from openai import OpenAI
from dotenv import load_dotenv
import logging
import tiktoken

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class ContentProcessor:
    """Processes content for microlearning generation"""
    
    def __init__(self, api_key: Optional[str] = None):
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY in .env file")
        
        self.client = OpenAI(api_key=self.api_key)
        self.encoding = tiktoken.encoding_for_model("gpt-4o-mini")
    
    def estimate_tokens(self, text: str) -> int:
        """Estimate token count for text"""
        return len(self.encoding.encode(text))
    
    def summarize_content(self, title: str, content: str, max_length: int = 2000) -> Dict[str, str]:
        """Summarize content while preserving key learning points"""
        try:
            # Truncate content if too long (leave room for response)
            content_tokens = self.estimate_tokens(content)
            if content_tokens > 12000:  # Rough limit for gpt-4o-mini
                # Keep first and last portions
                mid_point = len(content) // 2
                content = content[:5000] + "\n\n[... content truncated ...]\n\n" + content[-5000:]
            
            prompt = f"""You are creating a summary for a microlearning module. 

Title: {title}

Content:
{content}

Create a comprehensive summary that:
1. Captures the main concepts and key learning points
2. Preserves important technical details and examples
3. Is structured and clear
4. Maintains the educational value

Provide the summary in the following format:
- Key Concepts: [list main concepts]
- Main Content: [detailed summary]
- Key Takeaways: [important points to remember]

Summary:"""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating educational summaries that preserve learning value."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=2000,
                temperature=0.5
            )
            
            summary = response.choices[0].message.content.strip()
            
            return {
                "summary": summary,
                "original_length": len(content),
                "summary_length": len(summary)
            }
        
        except Exception as e:
            logger.error(f"Error summarizing content: {e}")
            # Fallback to first 2000 chars
            return {
                "summary": content[:max_length] + ("..." if len(content) > max_length else ""),
                "original_length": len(content),
                "summary_length": min(len(content), max_length)
            }
    
    def extract_key_points(self, content: str, num_points: int = 5) -> List[str]:
        """Extract key learning points from content"""
        try:
            prompt = f"""Extract {num_points} key learning points from this content. 
Each point should be concise (one sentence) and actionable.

Content:
{content[:3000]}

Provide only the key points, one per line, numbered:"""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at extracting key learning points."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=300,
                temperature=0.4
            )
            
            points_text = response.choices[0].message.content.strip()
            # Extract numbered points
            points = [line.strip() for line in points_text.split("\n") if line.strip() and (line.strip()[0].isdigit() or line.strip().startswith("-"))]
            
            # Clean up numbering
            cleaned_points = []
            for point in points:
                # Remove numbering
                for prefix in ["1.", "2.", "3.", "4.", "5.", "-", "•"]:
                    if point.startswith(prefix):
                        point = point[len(prefix):].strip()
                        break
                if point:
                    cleaned_points.append(point)
            
            return cleaned_points[:num_points]
        
        except Exception as e:
            logger.error(f"Error extracting key points: {e}")
            return []

