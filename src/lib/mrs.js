export const MRS_SYMPTOM_KEYS = [
  'hot_flashes',
  'heart_discomfort',
  'sleep_problems',
  'joint_muscle_discomfort',
  'depressive_mood',
  'irritability',
  'anxiety',
  'exhaustion',
  'sexual_problems',
  'bladder_problems',
  'vaginal_dryness',
]

export const CONFIDENCE_THRESHOLD = 0.6

// The backend rejects the request if mrs_scores is missing ANY of the 11
// keys (or has extra ones) — so every key must be present here, defaulting
// to 0 when neither the voice score nor a quiz answer covered it.
export function mergeScores(voiceResult, quizAnswers = {}) {
  const { mrs_scores = {} } = voiceResult || {}
  const merged = {}
  MRS_SYMPTOM_KEYS.forEach((key) => {
    if (Object.prototype.hasOwnProperty.call(quizAnswers, key)) {
      merged[key] = quizAnswers[key]
    } else if (key in mrs_scores) {
      merged[key] = mrs_scores[key]
    } else {
      merged[key] = 0
    }
  })
  return merged
}