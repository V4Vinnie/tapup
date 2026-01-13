# Dockerfile for TapUp Flask Application
FROM python:3.11-slim

# Set working directory
WORKDIR /app

# Install system dependencies (FFmpeg for video processing)
RUN apt-get update && apt-get install -y \
    ffmpeg \
    git \
    && rm -rf /var/lib/apt/lists/*

# Copy requirements first (for better caching)
COPY requirements.txt .

# Install Python dependencies
RUN pip install --no-cache-dir --upgrade pip && \
    pip install --no-cache-dir -r requirements.txt && \
    pip install --no-cache-dir gunicorn

# Copy application code
COPY . .

# Create necessary directories
RUN mkdir -p downloads output storage/microlearnings

# Expose port (Railway and Cloud Run use PORT env var)
EXPOSE 8080

# Use gunicorn for production
# Railway automatically sets PORT environment variable
CMD exec gunicorn --bind 0.0.0.0:${PORT:-8080} --workers 2 --threads 4 --timeout 300 app:app

