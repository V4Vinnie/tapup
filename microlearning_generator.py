"""
Microlearning Generator Module
Creates microlearning modules from content
"""

import os
from typing import Dict, Optional, List
from openai import OpenAI
from dotenv import load_dotenv
import logging
from datetime import datetime

from content_processor import ContentProcessor

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class MicrolearningGenerator:
    """Generates microlearning modules from content"""
    
    def __init__(self, target_skill: str, api_key: Optional[str] = None):
        self.target_skill = target_skill
        self.api_key = api_key or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError("OpenAI API key is required. Set OPENAI_API_KEY in .env file")
        
        self.client = OpenAI(api_key=self.api_key)
        self.processor = ContentProcessor(api_key=self.api_key)
    
    def create_microlearning(self, title: str, content: str, url: str, 
                            description: str = "") -> Dict:
        """Create a microlearning module from content"""
        try:
            logger.info(f"Creating microlearning for: {title[:50]}...")
            
            # Step 1: Summarize content
            summary_result = self.processor.summarize_content(title, content)
            summary = summary_result["summary"]
            
            # Step 2: Extract key learning points
            key_points = self.processor.extract_key_points(content, num_points=5)
            
            # Step 3: Generate structured microlearning
            microlearning = self._generate_structured_learning(
                title, summary, key_points, url, description
            )
            
            # Step 4: Create learning objectives
            objectives = self._generate_learning_objectives(title, summary)
            
            # Step 5: Create quick quiz/questions
            quiz_questions = self._generate_quiz_questions(summary, num_questions=3)
            
            # Assemble the microlearning module
            module = {
                "title": title,
                "target_skill": self.target_skill,
                "source_url": url,
                "description": description,
                "created_at": datetime.now().isoformat(),
                "summary": summary,
                "key_concepts": key_points,
                "learning_objectives": objectives,
                "content": microlearning,
                "quiz_questions": quiz_questions,
                "estimated_read_time": self._estimate_read_time(summary),
                "difficulty_level": self._estimate_difficulty(summary)
            }
            
            logger.info(f"Successfully created microlearning: {title[:50]}...")
            return module
        
        except Exception as e:
            logger.error(f"Error creating microlearning: {e}")
            # Return basic structure on error
            return {
                "title": title,
                "target_skill": self.target_skill,
                "source_url": url,
                "description": description,
                "created_at": datetime.now().isoformat(),
                "content": content[:2000] + ("..." if len(content) > 2000 else ""),
                "error": str(e)
            }
    
    def _generate_structured_learning(self, title: str, summary: str, 
                                     key_points: List[str], url: str, 
                                     description: str) -> str:
        """Generate structured learning content"""
        try:
            prompt = f"""Create a structured microlearning module (5-10 minutes to read) from this content.

Title: {title}
Summary: {summary}
Key Points: {chr(10).join(f"- {p}" for p in key_points)}

Format the microlearning module as:
1. Introduction (1-2 sentences)
2. Main Concepts (clear, concise explanations)
3. Examples or Use Cases (practical applications)
4. Summary (key takeaways)
5. Next Steps (suggested follow-up learning)

Keep it concise, engaging, and actionable. Target 5-10 minute reading time.

Microlearning Module:"""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating engaging microlearning content."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=1500,
                temperature=0.6
            )
            
            return response.choices[0].message.content.strip()
        
        except Exception as e:
            logger.error(f"Error generating structured learning: {e}")
            return summary
    
    def _generate_learning_objectives(self, title: str, summary: str) -> List[str]:
        """Generate learning objectives"""
        try:
            prompt = f"""Create 3-5 specific learning objectives for this microlearning module.

Title: {title}
Summary: {summary}

Learning objectives should be:
- Specific and measurable
- Actionable (use verbs like "understand", "apply", "explain")
- Aligned with the content

Provide only the objectives, one per line, numbered:"""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating learning objectives."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=200,
                temperature=0.4
            )
            
            objectives_text = response.choices[0].message.content.strip()
            objectives = [line.strip() for line in objectives_text.split("\n") if line.strip()]
            
            # Clean up numbering
            cleaned = []
            for obj in objectives:
                # Remove numbering
                for prefix in ["1.", "2.", "3.", "4.", "5.", "-", "•"]:
                    if obj.startswith(prefix):
                        obj = obj[len(prefix):].strip()
                        break
                if obj:
                    cleaned.append(obj)
            
            return cleaned[:5]
        
        except Exception as e:
            logger.error(f"Error generating learning objectives: {e}")
            return []
    
    def _generate_quiz_questions(self, summary: str, num_questions: int = 3) -> List[Dict]:
        """Generate quiz questions for reinforcement"""
        try:
            prompt = f"""Create {num_questions} quiz questions (multiple choice or short answer) to test understanding of this content.

Summary: {summary}

Format each question as:
Q: [question]
A: [correct answer]

Provide {num_questions} questions:"""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at creating educational quiz questions."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=500,
                temperature=0.5
            )
            
            questions_text = response.choices[0].message.content.strip()
            
            # Parse questions and answers
            questions = []
            current_q = None
            
            for line in questions_text.split("\n"):
                line = line.strip()
                if line.startswith("Q:") or line.startswith("Question:"):
                    if current_q:
                        questions.append(current_q)
                    current_q = {"question": line.replace("Q:", "").replace("Question:", "").strip(), "answer": ""}
                elif line.startswith("A:") or line.startswith("Answer:"):
                    if current_q:
                        current_q["answer"] = line.replace("A:", "").replace("Answer:", "").strip()
            
            if current_q:
                questions.append(current_q)
            
            return questions[:num_questions]
        
        except Exception as e:
            logger.error(f"Error generating quiz questions: {e}")
            return []
    
    def _estimate_read_time(self, text: str) -> int:
        """Estimate reading time in minutes (average 200 words per minute)"""
        word_count = len(text.split())
        minutes = max(1, round(word_count / 200))
        return minutes
    
    def _estimate_difficulty(self, content: str) -> str:
        """Estimate difficulty level"""
        try:
            prompt = f"""Rate the difficulty level of this content for someone learning "{self.target_skill}".

Content: {content[:1000]}

Respond with only one word: Beginner, Intermediate, or Advanced."""

            response = self.client.chat.completions.create(
                model="gpt-4o-mini",
                messages=[
                    {"role": "system", "content": "You are an expert at assessing learning difficulty levels."},
                    {"role": "user", "content": prompt}
                ],
                max_tokens=10,
                temperature=0.3
            )
            
            difficulty = response.choices[0].message.content.strip().title()
            if difficulty not in ["Beginner", "Intermediate", "Advanced"]:
                return "Intermediate"  # Default
            return difficulty
        
        except Exception as e:
            logger.error(f"Error estimating difficulty: {e}")
            return "Intermediate"

