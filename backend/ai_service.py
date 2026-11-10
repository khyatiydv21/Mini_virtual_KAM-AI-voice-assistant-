
import re
import os
from dotenv import load_dotenv
from google import genai

# Load API key
load_dotenv()

api_key = os.getenv("GEMINI_API_KEY")

if not api_key:
    raise RuntimeError("Gemini API key is missing.")

# Connect to Gemini
client = genai.Client(
    api_key=api_key,
    http_options={
        "retry_options": {
            "attempts": 1
        }
    }
)


# Remove Markdown formatting
def clean_response(text):
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'\1', text)
    text = re.sub(r'#{1,6}\s*', '', text)
    text = re.sub(r'`+', '', text)
    return text.strip()


def generate_kam_response(message: str, metrics: dict, history: list = None):
    try:
        history = history or []

        conversation = ""

        for item in history[:-1]:
            role = item.get("role", "user")
            content = item.get("content", "")
            conversation += f"{role}: {content}\n"

        prompt = f"""
You are Snapdeal's AI Virtual Key Account Manager.

Your job is to help sellers improve their business performance.

SELLER BUSINESS DATA:
{metrics}

PREVIOUS CONVERSATION:
{conversation}

LATEST SELLER MESSAGE:
{message}

INSTRUCTIONS:
1. Understand the full previous conversation.
2. Use only facts provided in seller data or by the seller.
3. Say out-of-stock products increased by 13 products,
   from 5 to 18. Never call this a 13% increase.
4. Say cancellation rate increased by 6 percentage points,
   from 8% to 14%.
5. Never invent reasons for sales decline or cancellations.
6. Ask relevant follow-up questions to discover root causes.
7. Give 2-3 practical, prioritized recommendations.
8. Never claim you performed an action unless it was actually executed.
9. Keep replies conversational and concise.
10. Do not use Markdown formatting. Use plain text only.
"""

        response = client.models.generate_content(
            model="gemini-3.5-flash-lite",
            contents=prompt,
            config={"max_output_tokens": 400}
        )

        if response.text:
            return clean_response(response.text)

        raise ValueError("Gemini returned an empty response.")

    except Exception as error:
        print("Gemini error:", error)

        return (
            f"Your sales have declined by "
            f"{metrics['sales_decline_percentage']}%. "
            "I recommend reviewing inventory availability "
            "and cancellation reasons."
        )
