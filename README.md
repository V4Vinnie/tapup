# Content Screening & Microlearning Agent

An intelligent agent that screens for new content related to a specific skill and automatically creates microlearnings from it.

## Features

- **Content Discovery**: Monitors multiple sources (RSS feeds, websites, APIs) for new content
- **Smart Filtering**: Uses AI to determine relevance to target skills
- **Microlearning Generation**: Automatically breaks down content into bite-sized learning modules
- **Scheduled Screening**: Runs periodic checks for new content
- **Content Tracking**: Prevents duplicate processing

## Setup

1. Install dependencies:
```bash
pip install -r requirements.txt
```

2. Create a `.env` file with your API keys:
```
OPENAI_API_KEY=your_openai_api_key_here
```

3. Configure your skill and content sources in `config.yaml` or via code

## Usage

```python
from agent import ContentScreeningAgent

# Initialize the agent
agent = ContentScreeningAgent(
    target_skill="Python Programming",
    sources=[
        "https://realpython.com/feed/",
        "https://dev.to/feed"
    ]
)

# Run a one-time screening
results = agent.screen_and_create_microlearnings()

# Or run continuously with scheduling
agent.run_continuously(check_interval_hours=6)
```

## Architecture

- `agent.py`: Main orchestrator class
- `content_discovery.py`: Handles content discovery from various sources
- `content_filter.py`: Filters content for relevance
- `content_processor.py`: Processes and summarizes content
- `microlearning_generator.py`: Creates microlearning modules
- `storage.py`: Handles content tracking and storage

