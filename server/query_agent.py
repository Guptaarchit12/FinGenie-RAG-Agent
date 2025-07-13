# query_agent.py
import google.generativeai as genai
import os
from dotenv import load_dotenv
import logging

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# Global variable to hold the Gemini model instance
_gemini_model = None

def _initialize_gemini_model():
    global _gemini_model
    if _gemini_model is None:
        load_dotenv()
        api_key = os.getenv("GEMINI_API_KEY")

        if not api_key:
            logging.error("GEMINI_API_KEY not found in environment variables. Please set it in a .env file or your system environment.")
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
        logging.error("Gemini model is not initialized. Check API key configuration.")
        raise ValueError("Gemini model is not initialized. Server misconfiguration.")

    try:
        # genai.GenerativeModel.generate_content is blocking,
        # but for an API, we can use async/await for I/O operations
        # If the underlying genai library doesn't have an async version,
        # you might need to run this in a thread pool for true non-blocking.
        # However, FastAPI handles blocking calls gracefully up to a point.
        # For simplicity, we'll keep it as is, or you can use `run_in_threadpool`.
        response = _gemini_model.generate_content(prompt)
        return response.text
    except Exception as e:
        logging.error(f"Error calling Gemini API: {e}")
        raise # Re-raise the exception for app.py to handle