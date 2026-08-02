// Member 2's backend: auth, entries, mrs-questions, suggestions, doctors.
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000'
// Member 3's separate AI/NLP service — not part of the backend above.
const NLP_BASE_URL = import.meta.env.VITE_NLP_BASE_URL || 'http://localhost:8001'

const MOCK = import.meta.env.VITE_MOCK_API === 'true'

function getToken() {
  return localStorage.getItem('saathi_token')
}

function setToken(token) {
  if (token) localStorage.setItem('saathi_token', token)
}

export function logout() {
  localStorage.removeItem('saathi_token')
}

async function apiFetch(path, { method = 'GET', body, auth = true, base = BASE_URL, form = false } = {}) {
  const headers = {}
  if (auth) {
    const token = getToken()
    if (token) headers.Authorization = `Bearer ${token}`
  }

  let requestBody
  if (form) {
    headers['Content-Type'] = 'application/x-www-form-urlencoded'
    requestBody = new URLSearchParams(body).toString()
  } else if (body) {
    headers['Content-Type'] = 'application/json'
    requestBody = JSON.stringify(body)
  }

  const res = await fetch(`${base}${path}`, { method, headers, body: requestBody })

  if (!res.ok) {
    const message = await res.text().catch(() => res.statusText)
    throw new Error(`${method} ${path} failed (${res.status}): ${message}`)
  }

  const contentType = res.headers.get('content-type') || ''
  return contentType.includes('application/json') ? res.json() : null
}

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

const MOCK_QUESTIONS = [
  { id: 'hot_flashes', question: 'How often do you get sudden waves of heat or sweating?', options: [
    { label: 'Never', score: 0 }, { label: 'Rarely', score: 1 }, { label: 'Sometimes', score: 2 }, { label: 'Often', score: 3 }, { label: 'Every day', score: 4 },
  ] },
  { id: 'heart_discomfort', question: 'Have you noticed your heart racing or skipping without exertion?', options: [
    { label: 'Never', score: 0 }, { label: 'Rarely', score: 1 }, { label: 'Sometimes', score: 2 }, { label: 'Often', score: 3 }, { label: 'Every day', score: 4 },
  ] },
  { id: 'sleep_problems', question: 'How has your sleep been — falling asleep or staying asleep?', options: [
    { label: 'No trouble at all', score: 0 }, { label: 'Slight trouble', score: 1 }, { label: 'Moderate trouble', score: 2 }, { label: 'Significant trouble', score: 3 }, { label: 'Severe trouble', score: 4 },
  ] },
  { id: 'joint_muscle_discomfort', question: 'Any new joint or muscle discomfort lately?', options: [
    { label: 'None', score: 0 }, { label: 'Mild', score: 1 }, { label: 'Moderate', score: 2 }, { label: 'Significant', score: 3 }, { label: 'Severe', score: 4 },
  ] },
  { id: 'depressive_mood', question: 'Have you been feeling low or down more than usual?', options: [
    { label: 'Not at all', score: 0 }, { label: 'Slightly', score: 1 }, { label: 'Moderately', score: 2 }, { label: 'Quite a bit', score: 3 }, { label: 'Constantly', score: 4 },
  ] },
  { id: 'irritability', question: 'How often do small things irritate you more than they used to?', options: [
    { label: 'Never', score: 0 }, { label: 'Rarely', score: 1 }, { label: 'Sometimes', score: 2 }, { label: 'Often', score: 3 }, { label: 'Constantly', score: 4 },
  ] },
  { id: 'anxiety', question: 'Have you felt anxious or on edge without a clear reason?', options: [
    { label: 'Never', score: 0 }, { label: 'Rarely', score: 1 }, { label: 'Sometimes', score: 2 }, { label: 'Often', score: 3 }, { label: 'Constantly', score: 4 },
  ] },
  { id: 'exhaustion', question: 'How often do you feel physically or mentally exhausted?', options: [
    { label: 'Never', score: 0 }, { label: 'Rarely', score: 1 }, { label: 'Sometimes', score: 2 }, { label: 'Often', score: 3 }, { label: 'Constantly', score: 4 },
  ] },
  { id: 'sexual_problems', question: 'Any change in sexual desire or comfort lately?', options: [
    { label: 'No change', score: 0 }, { label: 'Slight change', score: 1 }, { label: 'Moderate change', score: 2 }, { label: 'Significant change', score: 3 }, { label: 'Severe change', score: 4 },
  ] },
  { id: 'bladder_problems', question: 'Any new issues with bladder control or urgency?', options: [
    { label: 'None', score: 0 }, { label: 'Mild', score: 1 }, { label: 'Moderate', score: 2 }, { label: 'Significant', score: 3 }, { label: 'Severe', score: 4 },
  ] },
  { id: 'vaginal_dryness', question: 'Any dryness or discomfort you have noticed?', options: [
    { label: 'None', score: 0 }, { label: 'Mild', score: 1 }, { label: 'Moderate', score: 2 }, { label: 'Significant', score: 3 }, { label: 'Severe', score: 4 },
  ] },
]

function mockScoreText(text) {
  const lower = text.toLowerCase()
  const sounds_ambiguous = lower.includes('garmi') || lower.includes('neend') || lower.includes('sleep') || lower.includes('hot')

  if (sounds_ambiguous) {
    return {
      mrs_scores: { irritability: 1, exhaustion: 2 },
      confidence: { irritability: 0.8, exhaustion: 0.75, hot_flashes: 0.3, sleep_problems: 0.35 },
      ambiguous_symptoms: ['hot_flashes', 'sleep_problems'],
    }
  }

  return {
    mrs_scores: { irritability: 1, exhaustion: 1, anxiety: 0, depressive_mood: 0 },
    confidence: { irritability: 0.82, exhaustion: 0.79, anxiety: 0.85, depressive_mood: 0.88 },
    ambiguous_symptoms: [],
  }
}

// Registers the account (no token returned here), then logs in immediately
// to get a real access_token — matches the backend's two-step /register + /login.
export async function signup(phone, password, name) {
  if (MOCK) {
    await delay(500)
    const data = { token: 'mock-token', user: { phone, name } }
    setToken(data.token)
    return data
  }
  await apiFetch('/auth/register', { method: 'POST', body: { phone, password, name }, auth: false })
  return login(phone, password)
}

// Backend expects OAuth2PasswordRequestForm: form-urlencoded, phone in the
// 'username' field, response is { access_token, token_type }.
export async function login(phone, password) {
  if (MOCK) {
    await delay(500)
    const data = { token: 'mock-token', user: { phone } }
    setToken(data.token)
    return data
  }
  const data = await apiFetch('/auth/login', {
    method: 'POST',
    body: { username: phone, password },
    auth: false,
    form: true,
  })
  setToken(data.access_token)
  return data
}

export async function getMrsQuestions(lang = 'en') {
  if (MOCK) {
    await delay(300)
    return MOCK_QUESTIONS
  }
  return apiFetch(`/mrs-questions?lang=${lang}`)
}

// Member 3's separate NLP service — not the main backend.
export async function scoreText(text, lang = 'en') {
  if (MOCK) {
    await delay(700)
    return mockScoreText(text)
  }
  return apiFetch('/nlp/score', { method: 'POST', body: { text, lang }, base: NLP_BASE_URL, auth: false })
}

// rawText is required by the backend (SymptomEntryCreate.raw_text).
export async function submitEntry(rawText, mrsScores, source, stage) {
  const payload = { raw_text: rawText, mrs_scores: mrsScores, source }
  if (stage) payload.stage = stage

  if (MOCK) {
    await delay(300)
    console.log('[mock] submitEntry', payload)
    return { id: 'mock-entry', ...payload }
  }
  return apiFetch('/entries', { method: 'POST', body: payload })
}

// severity must be one of: none | mild | moderate | severe (matches the
// severity_band returned on a SymptomEntry) — not a free-text 'stage'.
export async function getSuggestions(severity, lang = 'en') {
  if (MOCK) {
    await delay(300)
    return { tips: ['Stay hydrated', 'Keep your room cool at night', 'Gentle stretching before bed'] }
  }
  return apiFetch(`/suggestions?severity=${severity}&lang=${lang}`)
}

export async function getNearbyDoctors(lat, lng, radiusM = 5000) {
  if (MOCK) {
    await delay(300)
    return []
  }
  return apiFetch(`/doctors/nearby?lat=${lat}&lng=${lng}&radius_m=${radiusM}`)
}