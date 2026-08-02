"""
Run with: python3 -m unittest tests.test_scoring -v
No external packages required — scoring.py is pure stdlib.
"""
import unittest

from app.scoring import (
    MRS_SYMPTOM_KEYS,
    compute_severity_band,
    total_score_of,
    validate_mrs_scores,
)


def full_payload(default_value: float = 0) -> dict:
    return {key: default_value for key in MRS_SYMPTOM_KEYS}


class TestValidateMrsScores(unittest.TestCase):
    def test_accepts_complete_valid_payload(self):
        payload = full_payload(2)
        validate_mrs_scores(payload)  # should not raise

    def test_rejects_missing_keys(self):
        payload = full_payload(1)
        del payload["hot_flashes"]
        with self.assertRaises(ValueError) as ctx:
            validate_mrs_scores(payload)
        self.assertIn("Missing", str(ctx.exception))
        self.assertIn("hot_flashes", str(ctx.exception))

    def test_rejects_unknown_keys(self):
        payload = full_payload(1)
        payload["made_up_symptom"] = 2
        with self.assertRaises(ValueError) as ctx:
            validate_mrs_scores(payload)
        self.assertIn("Unknown", str(ctx.exception))

    def test_rejects_out_of_range_scores(self):
        payload = full_payload(1)
        payload["anxiety"] = 5  # max is 4
        with self.assertRaises(ValueError) as ctx:
            validate_mrs_scores(payload)
        self.assertIn("between 0 and 4", str(ctx.exception))

    def test_rejects_negative_scores(self):
        payload = full_payload(1)
        payload["irritability"] = -1
        with self.assertRaises(ValueError):
            validate_mrs_scores(payload)

    def test_boundary_scores_are_valid(self):
        payload = full_payload(0)
        validate_mrs_scores(payload)
        payload = full_payload(4)
        validate_mrs_scores(payload)


class TestTotalScoreOf(unittest.TestCase):
    def test_sums_all_eleven_items(self):
        payload = full_payload(2)
        self.assertEqual(total_score_of(payload), 22)

    def test_zero_when_all_zero(self):
        self.assertEqual(total_score_of(full_payload(0)), 0)

    def test_max_possible_score(self):
        self.assertEqual(total_score_of(full_payload(4)), 44)

    def test_eleven_keys_defined(self):
        # guards against someone accidentally adding/removing a symptom
        # key without updating the content files to match
        self.assertEqual(len(MRS_SYMPTOM_KEYS), 11)


class TestComputeSeverityBand(unittest.TestCase):
    def test_none_band(self):
        for score in (0, 2, 4):
            self.assertEqual(compute_severity_band(score), "none")

    def test_mild_band(self):
        for score in (5, 6, 8):
            self.assertEqual(compute_severity_band(score), "mild")

    def test_moderate_band(self):
        for score in (9, 12, 15):
            self.assertEqual(compute_severity_band(score), "moderate")

    def test_severe_band(self):
        for score in (16, 30, 44):
            self.assertEqual(compute_severity_band(score), "severe")

    def test_band_boundaries_are_exact(self):
        # off-by-one errors at band edges are the classic bug here
        self.assertEqual(compute_severity_band(4), "none")
        self.assertEqual(compute_severity_band(5), "mild")
        self.assertEqual(compute_severity_band(8), "mild")
        self.assertEqual(compute_severity_band(9), "moderate")
        self.assertEqual(compute_severity_band(15), "moderate")
        self.assertEqual(compute_severity_band(16), "severe")

    def test_out_of_range_high_still_returns_severe(self):
        self.assertEqual(compute_severity_band(999), "severe")


if __name__ == "__main__":
    unittest.main()
