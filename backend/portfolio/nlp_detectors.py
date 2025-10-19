import os.path
from pathlib import Path

from gibberish_detector import detector



try:
	BASE_DIR = Path(__file__).resolve().parent.parent
	english_path = os.path.join(BASE_DIR, 'nlp_models', 'english.model')
	english_detector = detector.create_from_model(english_path)
	
	romanian_path = os.path.join(BASE_DIR, 'nlp_models', 'romanian.model')
	romanian_detector = detector.create_from_model(romanian_path)
	
except FileNotFoundError:
	print("Files not found")
	

def is_spam_gibberish(text: str) -> bool:
	if not text or len(text) < 2:
		return False
	
	is_english_gibberish = english_detector.is_gibberish(text)
	is_romanian_gibberish = romanian_detector.is_gibberish(text)
	
	return is_romanian_gibberish and is_english_gibberish