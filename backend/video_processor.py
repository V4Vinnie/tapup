"""
Video Processing Module
Handles YouTube video downloads, transcription, and 30-second clip creation
"""

import os
import yt_dlp
import whisper
import subprocess
from moviepy.editor import VideoFileClip
from typing import Dict, List, Optional, Tuple
import logging
from pathlib import Path
import re

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)


class VideoProcessor:
    """Processes YouTube videos for microlearning generation"""
    
    def __init__(self, download_dir: str = "downloads", output_dir: str = "output"):
        self.download_dir = Path(download_dir)
        self.output_dir = Path(output_dir)
        self.download_dir.mkdir(exist_ok=True)
        self.output_dir.mkdir(exist_ok=True)
        
        # Initialize Whisper model (base model for speed/quality balance)
        logger.info("Loading Whisper model...")
        self.whisper_model = whisper.load_model("base")
        logger.info("Whisper model loaded")
    
    def download_youtube_video(self, url: str) -> Dict[str, str]:
        """Download YouTube video and return metadata"""
        try:
            logger.info(f"Downloading YouTube video: {url}")
            
            ydl_opts = {
                'format': 'bestvideo[ext=mp4]+bestaudio[ext=m4a]/best[ext=mp4]/best',
                'outtmpl': str(self.download_dir / '%(id)s.%(ext)s'),
                'quiet': False,
                'no_warnings': False,
            }
            
            with yt_dlp.YoutubeDL(ydl_opts) as ydl:
                # Extract info
                info = ydl.extract_info(url, download=True)
                
                video_id = info.get('id', 'unknown')
                title = info.get('title', 'Untitled')
                description = info.get('description', '')
                duration = info.get('duration', 0)
                
                # Find the downloaded file
                video_file = None
                for ext in ['mp4', 'webm', 'mkv']:
                    potential_file = self.download_dir / f"{video_id}.{ext}"
                    if potential_file.exists():
                        video_file = str(potential_file)
                        break
                
                if not video_file:
                    raise FileNotFoundError(f"Downloaded video file not found for {video_id}")
                
                logger.info(f"Video downloaded: {video_file}")
                
                return {
                    'video_file': video_file,
                    'video_id': video_id,
                    'title': title,
                    'description': description,
                    'duration': duration,
                    'url': url
                }
        
        except Exception as e:
            logger.error(f"Error downloading YouTube video: {e}")
            raise
    
    def transcribe_video(self, video_file: str) -> Dict:
        """Transcribe video using Whisper"""
        try:
            logger.info(f"Transcribing video: {video_file}")
            
            result = self.whisper_model.transcribe(video_file)
            
            # Extract transcript text
            transcript_text = result['text']
            
            # Get segments with timestamps
            segments = []
            for segment in result['segments']:
                segments.append({
                    'start': segment['start'],
                    'end': segment['end'],
                    'text': segment['text'].strip()
                })
            
            logger.info(f"Transcription complete. {len(segments)} segments")
            
            return {
                'text': transcript_text,
                'segments': segments,
                'language': result.get('language', 'en')
            }
        
        except Exception as e:
            logger.error(f"Error transcribing video: {e}")
            raise
    
    def create_30_second_clips(self, video_file: str, transcript: Dict, 
                                num_clips: int = 3) -> List[Dict]:
        """Create 30-second TikTok-style clips from video"""
        try:
            logger.info(f"Creating {num_clips} 30-second clips from video")
            
            video = VideoFileClip(video_file)
            duration = video.duration
            clips = []
            
            # Calculate clip positions (distributed throughout the video)
            if duration <= 30:
                # Video is already short, use whole video
                clip_info = {
                    'start_time': 0,
                    'end_time': duration,
                    'duration': duration,
                    'output_file': None
                }
                clips.append(clip_info)
            else:
                # Create multiple 30-second clips
                clip_duration = 30.0
                available_duration = duration - clip_duration
                
                for i in range(num_clips):
                    # Distribute clips evenly across video
                    start_time = (available_duration / (num_clips + 1)) * (i + 1)
                    end_time = start_time + clip_duration
                    
                    # Ensure we don't exceed video duration
                    if end_time > duration:
                        start_time = duration - clip_duration
                        end_time = duration
                    
                    clip_info = {
                        'start_time': start_time,
                        'end_time': end_time,
                        'duration': clip_duration,
                        'output_file': None
                    }
                    clips.append(clip_info)
            
            # Actually create the clips
            output_clips = []
            for idx, clip_info in enumerate(clips):
                output_filename = self.output_dir / f"clip_{idx + 1}.mp4"
                
                # Extract clip
                clip = video.subclip(clip_info['start_time'], clip_info['end_time'])
                
                # Resize to vertical format (TikTok style: 9:16 aspect ratio)
                # Standard TikTok dimensions: 1080x1920
                target_height = 1920
                target_width = 1080
                
                # Resize maintaining aspect ratio, then crop/pad
                clip_resized = clip.resize(height=target_height)
                if clip_resized.w > target_width:
                    # Crop horizontally (center crop)
                    clip_resized = clip_resized.crop(x_center=clip_resized.w/2, 
                                                      width=target_width)
                elif clip_resized.w < target_width:
                    # Pad horizontally (center)
                    clip_resized = clip_resized.on_color(
                        size=(target_width, target_height),
                        color=(0, 0, 0),
                        pos='center'
                    )
                
                # Write clip
                clip_resized.write_videofile(
                    str(output_filename),
                    codec='libx264',
                    audio_codec='aac',
                    temp_audiofile='temp-audio.m4a',
                    remove_temp=True,
                    fps=30
                )
                
                clip_info['output_file'] = str(output_filename)
                output_clips.append(clip_info)
                
                # Clean up
                clip_resized.close()
            
            video.close()
            
            logger.info(f"Created {len(output_clips)} clips")
            return output_clips
        
        except Exception as e:
            logger.error(f"Error creating clips: {e}")
            raise
    
    def process_youtube_video(self, url: str, num_clips: int = 3) -> Dict:
        """Complete pipeline: download, transcribe, and create clips"""
        try:
            # Step 1: Download video
            video_info = self.download_youtube_video(url)
            
            # Step 2: Transcribe video
            transcript = self.transcribe_video(video_info['video_file'])
            
            # Step 3: Create 30-second clips
            clips = self.create_30_second_clips(
                video_info['video_file'],
                transcript,
                num_clips=num_clips
            )
            
            return {
                'video_info': video_info,
                'transcript': transcript,
                'clips': clips
            }
        
        except Exception as e:
            logger.error(f"Error processing YouTube video: {e}")
            raise
    
    def cleanup(self, video_id: str):
        """Clean up downloaded files"""
        try:
            # Remove downloaded video
            for ext in ['mp4', 'webm', 'mkv']:
                video_file = self.download_dir / f"{video_id}.{ext}"
                if video_file.exists():
                    video_file.unlink()
            
            logger.info(f"Cleaned up files for video: {video_id}")
        
        except Exception as e:
            logger.warning(f"Error cleaning up files: {e}")

