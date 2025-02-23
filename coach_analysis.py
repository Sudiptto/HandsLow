import base64
from huggingface_hub import InferenceClient

# Load API Key
with open("backend/keys/llama.txt", "r") as file:
    api_key = file.read().strip()
client = InferenceClient(api_key=api_key)

# Load Boxing Coach Prompt
COACH_PROMPT = """You are a professional boxing coach analyzing a fighter's form based on an image. 
Evaluate the following key aspects of their technique:
1. **Punch Execution:** Are they extending fully? Is the wrist aligned properly?
2. **Guard Position:** Are their hands protecting their chin? Are they dropping their hands after throwing a punch?
3. **Stance & Footwork:** Is their weight balanced? Are they pivoting correctly?
4. **Hip & Shoulder Rotation:** Are they generating power from their core or just using arm strength?
5. **Overall Feedback:** What are the biggest mistakes? What should they improve?

Provide **constructive feedback** and suggest drills to correct form.
"""

def recognize(image_url):
    """Analyzes boxing form from an image using LLaMA 3.2."""
    messages = [
        {
            "role": "user",
            "content": [
                {"type": "image_url", "image_url": {"url": image_url}},
                {"type": "text", "text": COACH_PROMPT},
            ],
        }
    ]

    # Send request to LLaMA API
    stream = client.chat.completions.create(
        model="meta-llama/Llama-3.2-11B-Vision-Instruct",
        messages=messages,
        max_tokens=500,
        stream=True
    )

    critique = ""
    for chunk in stream:
        content = chunk.choices[0].delta.content
        if content:
            critique += content

    return critique.strip()

