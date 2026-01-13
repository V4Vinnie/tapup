# Migration Guide: OpenAI to Gemini

## Quick Summary

Switching to Gemini will:
- **Save ~33% on API costs**
- **Give you 8x larger context window** (1M vs 128k tokens)
- **Improve performance** for video content (multimodal)

## Step 1: Install Gemini SDK

```bash
pip install google-generativeai
```

## Step 2: Get Gemini API Key

1. Go to [Google AI Studio](https://aistudio.google.com/app/apikey)
2. Create an API key
3. Add to `.env`:
   ```
   GEMINI_API_KEY=your_key_here
   ```

## Step 3: Update Code

### Example: Content Processor Migration

**Before (OpenAI):**
```python
from openai import OpenAI

client = OpenAI(api_key=api_key)
response = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are an expert..."},
        {"role": "user", "content": prompt}
    ],
    max_tokens=2000,
    temperature=0.5
)
result = response.choices[0].message.content
```

**After (Gemini):**
```python
import google.generativeai as genai

genai.configure(api_key=api_key)
model = genai.GenerativeModel('gemini-2.0-flash-exp')

response = model.generate_content(
    f"""You are an expert...

{prompt}""",
    generation_config={
        "max_output_tokens": 2000,
        "temperature": 0.5,
    }
)
result = response.text
```

## Step 4: Key Differences

| Aspect | OpenAI | Gemini |
|--------|--------|--------|
| Client | `OpenAI(api_key=key)` | `genai.configure(api_key=key)` |
| Model | `model="gpt-4o-mini"` | `GenerativeModel('gemini-2.0-flash-exp')` |
| Messages | `messages=[...]` | Combined in single prompt string |
| System Message | Separate `{"role": "system"}` | Include in prompt string |
| Response | `response.choices[0].message.content` | `response.text` |
| Max Tokens | `max_tokens=2000` | `max_output_tokens=2000` |
| Token Counting | `tiktoken` library | Built into SDK |

## Step 5: Update All Files

Files to update:
- `content_processor.py`
- `content_filter.py`
- `microlearning_generator.py`
- `video_microlearning_generator.py`

## Step 6: Token Counting

**Before (OpenAI):**
```python
import tiktoken
encoding = tiktoken.encoding_for_model("gpt-4o-mini")
tokens = len(encoding.encode(text))
```

**After (Gemini):**
```python
import google.generativeai as genai
model = genai.GenerativeModel('gemini-2.0-flash-exp')
# Gemini automatically handles token counting
# You can use approximate: ~4 characters per token
tokens = len(text) // 4
```

Or use Gemini's built-in token counting:
```python
count_tokens = model.count_tokens(text)
tokens = count_tokens.total_tokens
```

## Model Options

**Recommended: Gemini 2.0 Flash**
- `gemini-2.0-flash-exp` - Fast, cheap, good quality
- Best for: Most use cases

**Alternative: Gemini 1.5 Pro**
- `gemini-1.5-pro` - Higher quality, more expensive
- Best for: Complex reasoning tasks

## Testing

After migration, test:
1. Content summarization
2. Key point extraction
3. Quiz generation
4. Video transcript processing
5. All existing functionality

## Rollback Plan

Keep OpenAI code commented out for easy rollback:
```python
# OLD: OpenAI
# client = OpenAI(api_key=openai_key)
# response = client.chat.completions.create(...)

# NEW: Gemini
genai.configure(api_key=gemini_key)
model = genai.GenerativeModel('gemini-2.0-flash-exp')
response = model.generate_content(...)
```

## Cost Monitoring

Monitor usage in:
- [Google AI Studio](https://aistudio.google.com/) - Usage dashboard
- Check costs vs previous OpenAI costs

## Next Steps

1. ✅ Install `google-generativeai`
2. ✅ Get API key
3. ✅ Test one module (e.g., `content_processor.py`)
4. ✅ Migrate all modules
5. ✅ Update `requirements.txt`
6. ✅ Deploy and monitor

Would you like me to help migrate your code?

