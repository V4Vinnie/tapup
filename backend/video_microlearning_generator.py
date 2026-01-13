"""
Video Microlearning Generator
Creates TikTok-style 30-second video microlearnings with quizzes
"""

import os
import uuid
from typing import Dict, Optional, List
import google.generativeai as genai
from dotenv import load_dotenv
import logging
from datetime import datetime

from video_processor import VideoProcessor
from content_processor import ContentProcessor

load_dotenv()
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VideoMicrolearningGenerator:
    """Generates video microlearnings from YouTube videos"""
    
    def __init__(self, target_skill: str, api_key: Optional[str] = None):
        self.target_skill = target_skill
        self.api_key = api_key or os.getenv("GEMINI_API_KEY") or os.getenv("OPENAI_API_KEY")
        
        if not self.api_key:
            raise ValueError("Gemini API key is required. Set GEMINI_API_KEY in .env file")
        
        genai.configure(api_key=self.api_key)
        self.model = genai.GenerativeModel('gemini-2.0-flash-exp')
        self.processor = ContentProcessor(api_key=self.api_key)
        self.video_processor = VideoProcessor()
    
    def create_video_microlearning(self, youtube_url: str, num_clips: int = 3) -> Dict:
        """Create video microlearning from YouTube URL"""
        try:
            logger.info(f"Creating video microlearning from: {youtube_url}")
            
            # Step 1: Process video (download, transcribe, create clips)
            video_data = self.video_processor.process_youtube_video(youtube_url, num_clips=num_clips)
            
            video_info = video_data['video_info']
            transcript = video_data['transcript']
            clips = video_data['clips']
            
            # Step 2: Summarize transcript
            summary_result = self.processor.summarize_content(
                video_info['title'],
                transcript['text']
            )
            summary = summary_result['summary']
            
            # Step 3: Extract key learning points
            key_points = self.processor.extract_key_points(transcript['text'], num_points=5)
            
            # Step 4: Generate learning objectives
            objectives = self._generate_learning_objectives(video_info['title'], summary)
            
            # Step 5: Generate quiz questions
            quiz_questions = self._generate_quiz_questions(summary, num_questions=5)
            
            # Step 6: Create descriptions for each clip
            clip_descriptions = self._create_clip_descriptions(clips, transcript['segments'])
            
            # Assemble the microlearning module
            microlearning = {
                'id': str(uuid.uuid4()),
                'title': video_info['title'],
                'target_skill': self.target_skill,
                'source_url': youtube_url,
                'description': video_info['description'][:500] if video_info['description'] else '',
                'created_at': datetime.now().isoformat(),
                'type': 'video',
                'video_id': video_info['video_id'],
                'duration': video_info['duration'],
                'summary': summary,
                'transcript': transcript['text'],
                'key_concepts': key_points,
                'learning_objectives': objectives,
                'clips': [
                    {
                        'clip_number': idx + 1,
                        'video_file': os.path.basename(clip['output_file']),  # Just filename, not full path
                        'start_time': clip['start_time'],
                        'end_time': clip['end_time'],
                        'duration': clip['duration'],
                        'description': clip_descriptions[idx] if idx < len(clip_descriptions) else ''
                    }
                    for idx, clip in enumerate(clips)
                ],
                'quiz_questions': quiz_questions,
                'estimated_watch_time': len(clips) * 30,  # 30 seconds per clip
                'difficulty_level': self._estimate_difficulty(summary)
            }
            
            logger.info(f"Successfully created video microlearning: {video_info['title'][:50]}...")
            return microlearning
        
        except Exception as e:
            logger.error(f"Error creating video microlearning: {e}")
            raise
    
    def _generate_learning_objectives(self, title: str, summary: str) -> List[str]:
        """Generate learning objectives"""
        try:
            prompt = f"""You are an expert at creating learning objectives.

Create 3-5 specific learning objectives for this video microlearning module.

Title: {title}
Summary: {summary}

Learning objectives should be:
- Specific and measurable
- Actionable (use verbs like "understand", "apply", "explain")
- Aligned with the content

Provide only the objectives, one per line, numbered:"""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 200,
                    "temperature": 0.4,
                }
            )
            
            objectives_text = response.text.strip()
            objectives = [line.strip() for line in objectives_text.split("\n") if line.strip()]
            
            # Clean up numbering
            cleaned = []
            for obj in objectives:
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
    
    def _generate_quiz_questions(self, summary: str, num_questions: int = 5) -> List[Dict]:
        """Generate quiz questions for reinforcement"""
        try:
            prompt = f"""You are an expert at creating educational quiz questions.

Create {num_questions} quiz questions (multiple choice with 4 options each) to test understanding of this video content.

Summary: {summary}

Format each question as:
Q: [question]
A: [correct answer]
B: [wrong option 1]
C: [wrong option 2]
D: [wrong option 3]

Provide {num_questions} questions:"""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 800,
                    "temperature": 0.5,
                }
            )
            
            questions_text = response.text.strip()
            
            # Parse questions with better logic
            questions = []
            current_q = None
            option_labels = ['A', 'B', 'C', 'D']
            
            lines = questions_text.split("\n")
            i = 0
            while i < len(lines):
                line = lines[i].strip()
                if not line:
                    i += 1
                    continue
                
                if line.startswith("Q:") or line.startswith("Question:"):
                    if current_q:
                        questions.append(current_q)
                    current_q = {
                        "question": line.replace("Q:", "").replace("Question:", "").strip(),
                        "options": {},
                        "correct_answer": "A"  # Default to A
                    }
                elif current_q and any(line.startswith(f"{label}:") for label in option_labels):
                    for label in option_labels:
                        if line.startswith(f"{label}:"):
                            option_text = line[len(label)+1:].strip()
                            current_q["options"][label] = option_text
                            break
                
                i += 1
            
            if current_q:
                questions.append(current_q)
            
            return questions[:num_questions]
        
        except Exception as e:
            logger.error(f"Error generating quiz questions: {e}")
            return []
    
    def _create_clip_descriptions(self, clips: List[Dict], segments: List[Dict]) -> List[str]:
        """Create descriptions for each clip based on transcript segments"""
        try:
            descriptions = []
            for clip in clips:
                start = clip['start_time']
                end = clip['end_time']
                
                # Find segments that overlap with this clip
                clip_segments = [
                    seg['text'] for seg in segments
                    if seg['start'] >= start and seg['end'] <= end
                ]
                
                if clip_segments:
                    clip_text = " ".join(clip_segments)
                    # Generate brief description
                    description = clip_text[:200] + "..." if len(clip_text) > 200 else clip_text
                else:
                    description = f"Clip from {start:.1f}s to {end:.1f}s"
                
                descriptions.append(description)
            
            return descriptions
        
        except Exception as e:
            logger.error(f"Error creating clip descriptions: {e}")
            return [f"Clip {i+1}" for i in range(len(clips))]
    
    def _estimate_difficulty(self, content: str) -> str:
        """Estimate difficulty level"""
        try:
            prompt = f"""You are an expert at assessing learning difficulty levels.

Rate the difficulty level of this content for someone learning "{self.target_skill}".

Content: {content[:1000]}

Respond with only one word: Beginner, Intermediate, or Advanced."""

            response = self.model.generate_content(
                prompt,
                generation_config={
                    "max_output_tokens": 10,
                    "temperature": 0.3,
                }
            )
            
            difficulty = response.text.strip().title()
            if difficulty not in ["Beginner", "Intermediate", "Advanced"]:
                return "Intermediate"
            return difficulty
        
        except Exception as e:
            logger.error(f"Error estimating difficulty: {e}")
            return "Intermediate"

