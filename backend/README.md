# TapUp - The Swipe Academy

A micro-learning platform that offers next-gen educational content designed for fast consumption. Create bite-sized microlearnings from any content using AI.

## Features

- **Content Discovery**: Monitors multiple sources (RSS feeds, websites, APIs) for new content
- **Smart Filtering**: Uses AI to determine relevance to target skills
- **Microlearning Generation**: Automatically breaks down content into bite-sized learning modules
- **User Authentication**: Firebase-based user registration and authentication
- **User Dashboard**: Manage your personal microlearnings
- **Web Interface**: Modern, responsive web application
- **Scheduled Screening**: Runs periodic checks for new content (CLI mode)

## Setup

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Set Up Firebase

See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for detailed Firebase configuration instructions.

1. Create a Firebase project at [Firebase Console](https://console.firebase.google.com/)
2. Enable Email/Password authentication
3. Create a Firestore database
4. Get your Firebase configuration

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
# Firebase Configuration
FIREBASE_API_KEY=your_api_key_here
FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
FIREBASE_MESSAGING_SENDER_ID=your_sender_id
FIREBASE_APP_ID=your_app_id

# Flask Secret Key
SECRET_KEY=your-secret-key-here

# Gemini API Key (for microlearning generation)
GEMINI_API_KEY=your_gemini_api_key_here
# Note: You can still use OPENAI_API_KEY as fallback if needed
```

### 4. Run the Web Application

```bash
python app.py
```

Visit `http://localhost:5000` in your browser.

## Usage

### Web Application

1. **Register**: Create a new account at `/register`
2. **Login**: Sign in at `/login`
3. **Dashboard**: View your microlearnings at `/dashboard`
4. **Create**: Generate new microlearnings at `/create`
   - From URL: Paste a URL to generate from web content
   - From Text: Paste content directly

### CLI Agent (Original Functionality)

```python
from agent import ContentScreeningAgent

# Initialize the agent
agent = ContentScreeningAgent(
    target_skill="Python Programming",
    sources=[
        "https://realpython.com/atom.xml",
        "https://dev.to/feed/tag/python"
    ]
)

# Run a one-time screening
results = agent.screen_and_create_microlearnings()

# Or run continuously with scheduling
agent.run_continuously(check_interval_hours=6)
```

## Architecture

### Web Application
- `app.py`: Flask web application and API endpoints
- `firebase_service.py`: Firebase integration for user management
- `templates/`: HTML templates for web pages
- `static/css/`: Stylesheets
- `static/js/`: Client-side JavaScript

### Core Agent System
- `agent.py`: Main orchestrator class
- `content_discovery.py`: Handles content discovery from various sources
- `content_filter.py`: Filters content for relevance using AI
- `content_processor.py`: Processes and summarizes content
- `microlearning_generator.py`: Creates microlearning modules
- `storage.py`: Handles content tracking and storage (file-based)

### Database Structure (Firestore)

**Users Collection** (`users/{userId}`)
```json
{
  "email": "user@example.com",
  "display_name": "John Doe",
  "created_at": "2024-01-01T00:00:00Z",
  "updated_at": "2024-01-01T00:00:00Z"
}
```

**Microlearnings Collection** (`microlearnings/{microlearningId}`)
```json
{
  "user_id": "userId",
  "title": "Python Decorators",
  "target_skill": "Python Programming",
  "summary": "...",
  "key_concepts": ["concept1", "concept2"],
  "learning_objectives": ["objective1", "objective2"],
  "content": "...",
  "quiz_questions": [...],
  "estimated_read_time": 5,
  "difficulty_level": "Intermediate",
  "source_url": "https://example.com",
  "created_at": "2024-01-01T00:00:00Z"
}
```

## Development

### Project Structure

```
tapup/
├── app.py                  # Flask web application
├── agent.py                # Content screening agent
├── content_discovery.py    # Content discovery module
├── content_filter.py       # AI content filtering
├── content_processor.py    # Content processing
├── microlearning_generator.py  # Microlearning generation
├── firebase_service.py     # Firebase integration
├── storage.py              # File-based storage
├── templates/              # HTML templates
│   ├── base.html
│   ├── index.html
│   ├── register.html
│   ├── login.html
│   ├── dashboard.html
│   └── create.html
├── static/
│   ├── css/
│   │   └── style.css
│   └── js/
│       ├── auth.js
│       ├── register.js
│       ├── login.js
│       ├── dashboard.js
│       └── create.js
├── requirements.txt
├── .env                    # Environment variables (not committed)
└── README.md
```

## License

MIT License

## Contributing

Contributions welcome! Please feel free to submit a Pull Request.
