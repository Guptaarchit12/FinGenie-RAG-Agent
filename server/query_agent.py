import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging

logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

_gemini_model = None

def _initialize_gemini_model():
    global _gemini_model
    if _gemini_model is None:
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            logging.error("GEMINI_API_KEY not found in environment variables.")
            raise ValueError("GEMINI_API_KEY is not set. Cannot initialize Gemini model.")

        try:
            genai.configure(api_key=api_key)
            _gemini_model = genai.GenerativeModel('gemini-2.5-flash')
            logging.info("Gemini API and model successfully configured.")
        except Exception as e:
            logging.error(f"Failed to configure Gemini API or load model: {e}")
            raise

try:
    _initialize_gemini_model()
except ValueError as e:
    pass

async def get_gemini_response(prompt: str) -> str:
    if _gemini_model is None:
        logging.error("Gemini model is not initialized.")
        raise ValueError("Gemini model is not initialized. Server misconfiguration.")

    try:
        response = _gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logging.error(f"Error calling Gemini API: {e}")
        raise
