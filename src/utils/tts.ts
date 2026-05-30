export function speak(text: string, lang: string = 'ja-JP'): void {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = lang
  utterance.rate = 0.85
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(utterance)
}

export function stopSpeaking(): void {
  window.speechSynthesis.cancel()
}

export interface RecognitionResult {
  transcript: string
  confidence: number
}

interface SpeechRecognitionInstance {
  lang: string
  interimResults: boolean
  maxAlternatives: number
  onresult: ((event: SpeechRecognitionEvent) => void) | null
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null
  start(): void
  stop(): void
}

type SpeechRecognitionCtor = new () => SpeechRecognitionInstance

type AnyWindow = typeof window & {
  SpeechRecognition?: SpeechRecognitionCtor
  webkitSpeechRecognition?: SpeechRecognitionCtor
}

export function startRecognition(
  lang: string,
  onResult: (result: RecognitionResult) => void,
  onError: (error: string) => void
): () => void {
  const win = window as AnyWindow
  const SR = win.SpeechRecognition ?? win.webkitSpeechRecognition
  if (!SR) {
    onError('SpeechRecognition not supported')
    return () => {}
  }
  const recognition = new SR()
  recognition.lang = lang
  recognition.interimResults = false
  recognition.maxAlternatives = 1
  recognition.onresult = (event: SpeechRecognitionEvent) => {
    const r = event.results[0][0]
    onResult({ transcript: r.transcript, confidence: r.confidence })
  }
  recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
    onError(event.error)
  }
  recognition.start()
  return () => recognition.stop()
}
