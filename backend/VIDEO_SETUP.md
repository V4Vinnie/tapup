# Video Processing Setup Guide

This guide will help you set up video processing capabilities for creating TikTok-style microlearnings from YouTube videos.

## System Requirements

1. **FFmpeg** - Required for video processing
   - macOS: `brew install ffmpeg`
   - Ubuntu/Debian: `sudo apt-get install ffmpeg`
   - Windows: Download from https://ffmpeg.org/download.html

2. **Python Dependencies** - Install from requirements.txt:
   ```bash
   pip install -r requirements.txt
   ```

## Key Dependencies

- **yt-dlp**: Downloads YouTube videos
- **openai-whisper**: Transcribes video audio (speech-to-text)
- **moviepy**: Video editing and clip creation
- **ffmpeg-python**: FFmpeg Python bindings

## Installation Steps

### 1. Install FFmpeg

**macOS:**
```bash
brew install ffmpeg
```

**Ubuntu/Debian:**
```bash
sudo apt-get update
sudo apt-get install ffmpeg
```

**Windows:**
1. Download FFmpeg from https://ffmpeg.org/download.html
2. Extract and add to PATH

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

**Note:** The first time you run the application, Whisper will download the model (~150MB). This happens automatically.

### 3. Verify Installation

```bash
# Check FFmpeg
ffmpeg -version

# Check Python imports
python -c "import yt_dlp; import whisper; import moviepy; print('All imports successful')"
```

## How It Works

1. **YouTube Download**: Uses `yt-dlp` to download the video
2. **Transcription**: Uses OpenAI Whisper to transcribe audio
3. **Clip Creation**: Uses MoviePy to create 30-second vertical (9:16) clips
4. **AI Processing**: Uses OpenAI to generate summaries, key points, and quiz questions

## Usage

1. Go to `/create` page
2. Paste a YouTube URL
3. Select target skill and number of clips
4. Click "Generate Video Microlearning"
5. Wait for processing (may take 5-10 minutes depending on video length)
6. View your 30-second TikTok-style clips with quiz

## Performance Notes

- Video processing can be CPU-intensive
- First run downloads Whisper model (~150MB)
- Processing time depends on:
  - Video length
  - Number of clips requested
  - Your hardware

## Troubleshooting

### "FFmpeg not found"
- Install FFmpeg (see step 1)
- Ensure FFmpeg is in your PATH
- Restart your terminal/IDE

### "Whisper model download failed"
- Check internet connection
- Whisper downloads models on first use
- Models are cached for future use

### "Video download failed"
- Check YouTube URL is valid
- Some videos may be region-locked or unavailable
- Check your internet connection

### "Out of memory errors"
- Try processing shorter videos
- Reduce number of clips
- Close other applications

## Directory Structure

```
tapup/
├── downloads/          # Downloaded YouTube videos (temporary)
├── output/             # Generated video clips
└── ...
```

These directories are created automatically and are ignored by git.

