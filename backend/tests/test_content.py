"""
Run with: python3 -m unittest tests.test_content -v
Tests run against the REAL content/*.json files Member 4 will edit —
this is what catches "someone renamed a key" or "Hindi file is missing
an item" before it becomes a 2am hackathon bug.
"""
import unittest

from app.content import ContentNotFoundError, get_questions, get_suggestions
from app.scoring import MRS_SYMPTOM_KEYS


class TestGetQuestions(unittest.TestCase):
    def test_english_has_all_eleven_items(self):
        questions = get_questions("en")
        self.assertEqual(len(questions), 11)

    def test_hindi_has_all_eleven_items(self):
        questions = get_questions("hi")
        self.assertEqual(len(questions), 11)

    def test_english_ids_match_scoring_keys_exactly(self):
        ids = {q["id"] for q in get_questions("en")}
        self.assertEqual(ids, set(MRS_SYMPTOM_KEYS))

    def test_hindi_ids_match_scoring_keys_exactly(self):
        ids = {q["id"] for q in get_questions("hi")}
        self.assertEqual(ids, set(MRS_SYMPTOM_KEYS))

    def test_every_question_has_five_score_options_0_to_4(self):
        for lang in ("en", "hi"):
            for q in get_questions(lang):
                scores = sorted(opt["score"] for opt in q["options"])
                self.assertEqual(scores, [0, 1, 2, 3, 4], msg=f"{lang}/{q['id']}")

    def test_missing_language_raises_content_not_found(self):
        with self.assertRaises(ContentNotFoundError):
            get_questions("fr")


class TestGetSuggestions(unittest.TestCase):
    def test_all_four_severity_bands_exist_in_both_languages(self):
        for band in ("none", "mild", "moderate", "severe"):
            for lang in ("en", "hi"):
                result = get_suggestions(band, lang)
                self.assertIn("diet", result)
                self.assertIn("exercise", result)
                self.assertTrue(len(result["diet"]) > 0)
                self.assertTrue(len(result["exercise"]) > 0)

    def test_unknown_severity_raises(self):
        with self.assertRaises(ContentNotFoundError):
            get_suggestions("catastrophic", "en")

    def test_unknown_language_raises(self):
        with self.assertRaises(ContentNotFoundError):
            get_suggestions("mild", "fr")

    def test_severe_band_mentions_doctor_in_both_languages(self):
        # the one band where "see a doctor" absolutely must not get lost in translation
        en_note = get_suggestions("severe", "en")["note"].lower()
        hi_note = get_suggestions("severe", "hi")["note"]
        self.assertIn("doctor", en_note)
        self.assertIn("डॉक्टर", hi_note)


if __name__ == "__main__":
    unittest.main()
