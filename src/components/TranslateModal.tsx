import { useState, useRef, useEffect, useCallback } from 'react'
import { v4 as uuidv4 } from 'uuid'
import type { AppSettings, Phrase, ScenarioKey } from '../types'
import type { ThemeTokens } from '../theme'
import { translateText, ocrImage } from '../utils/translate'
import { startRecognition } from '../utils/tts'

type Mode = 'voice' | 'camera' | 'type'

interface Props {
  initialMode: Mode
  settings: AppSettings
  T: ThemeTokens
  onClose: () => void
  onSavePhrase: (phrase: Phrase) => void
}

export default function TranslateModal({ initialMode, settings, T, onClose, onSavePhrase }: Props) {
  const [mode, setMode] = useState<Mode>(initialMode)
  const [status, setStatus] = useState<'idle' | 'loading' | 'result' | 'error'>('idle')
  const [inputText, setInputText] = useState('')
  const [resultJapanese, setResultJapanese] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [isListening, setIsListening] = useState(false)
  const stopRecognitionRef = useRef<(() => void) | null>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  const stopCamera = useCallback(() => {
    streamRef.current?.getTracks().forEach(t => t.stop())
    streamRef.current = null
  }, [])

  const startCamera = useCallback(async (): Promise<string | null> => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      streamRef.current = stream
      if (videoRef.current) {
        videoRef.current.srcObject = stream
        videoRef.current.play()
      }
      return null
    } catch {
      return 'Camera access denied'
    }
  }, [])

  useEffect(() => {
    if (mode === 'camera') {
      startCamera().then(err => {
        if (err) { setErrorMsg(err); setStatus('error') }
      })
    } else {
      stopCamera()
    }
    return () => { stopCamera() }
  }, [mode, startCamera, stopCamera])

  function captureBase64(): string {
    const video = videoRef.current!
    const canvas = canvasRef.current!
    canvas.width = video.videoWidth
    canvas.height = video.videoHeight
    canvas.getContext('2d')!.drawImage(video, 0, 0)
    return canvas.toDataURL('image/jpeg', 0.8).split(',')[1]
  }

  async function handleCameraCapture() {
    setStatus('loading')
    try {
      const b64 = captureBase64()
      const text = await ocrImage(b64)
      if (!text) { setErrorMsg('No text detected in image'); setStatus('error'); return }
      const res = await translateText(text, 'ja')
      setResultJapanese(res.translatedText)
      setStatus('result')
    } catch (e) {
      setErrorMsg(String(e))
      setStatus('error')
    }
  }

  async function handleTypeSubmit() {
    if (!inputText.trim()) return
    setStatus('loading')
    try {
      const res = await translateText(inputText.trim(), 'ja', settings.nativeLang === 'zh-TW' ? 'zh-TW' : 'en')
      setResultJapanese(res.translatedText)
      setStatus('result')
    } catch (e) {
      setErrorMsg(String(e))
      setStatus('error')
    }
  }

  function handleVoice() {
    if (isListening) {
      stopRecognitionRef.current?.()
      setIsListening(false)
      return
    }
    setIsListening(true)
    setStatus('idle')
    const lang = settings.nativeLang === 'zh-TW' ? 'zh-TW' : 'en-US'
    stopRecognitionRef.current = startRecognition(
      lang,
      async ({ transcript }) => {
        setIsListening(false)
        setInputText(transcript)
        setStatus('loading')
        try {
          const res = await translateText(transcript, 'ja')
          setResultJapanese(res.translatedText)
          setStatus('result')
        } catch (e) {
          setErrorMsg(String(e))
          setStatus('error')
        }
      },
      (err) => {
        setIsListening(false)
        setErrorMsg(err)
        setStatus('error')
      }
    )
  }

  function handleSave() {
    const phrase: Phrase = {
      id: uuidv4(),
      scenario: 'shopping' as ScenarioKey,
      japanese: resultJapanese,
      romaji: '',
      meaning: inputText || '(from translation)',
      isCustom: true,
      isFavorite: false,
    }
    onSavePhrase(phrase)
    onClose()
  }

  return (
    <>
      <div onClick={onClose} style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', zIndex: 40 }} />
      <div style={{ position: 'fixed', bottom: 0, left: '50%', transform: 'translateX(-50%)', width: '100%', maxWidth: 480, background: T.surface, borderRadius: '20px 20px 0 0', padding: '16px 16px 40px', zIndex: 50 }}>
        <div style={{ width: 36, height: 4, background: T.border, borderRadius: 2, margin: '0 auto 16px' }} />

        {/* Mode tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
          {(['voice', 'camera', 'type'] as Mode[]).map(m => (
            <button key={m} onClick={() => { setMode(m); setStatus('idle'); setInputText(''); setResultJapanese('') }}
              style={{ flex: 1, background: mode === m ? T.accent : T.surface2, color: mode === m ? '#fff' : T.muted, border: 'none', borderRadius: 8, padding: '8px 0', cursor: 'pointer', fontSize: 12, fontWeight: 600 }}>
              {m === 'voice' ? '🎤 Voice' : m === 'camera' ? '📷 Camera' : '⌨️ Type'}
            </button>
          ))}
        </div>

        {/* Voice mode */}
        {mode === 'voice' && (
          <div style={{ textAlign: 'center', padding: '16px 0' }}>
            <button onClick={handleVoice}
              style={{ width: 72, height: 72, borderRadius: '50%', background: isListening ? '#ef4444' : T.accent, border: 'none', cursor: 'pointer', fontSize: 30, display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', boxShadow: `0 4px 16px ${T.accentShadow}` }}>
              {isListening ? '⏹' : '🎤'}
            </button>
            <div style={{ color: T.muted, fontSize: 12 }}>{isListening ? 'Listening... tap to stop' : 'Tap to speak'}</div>
            {inputText && <div style={{ color: T.muted, fontSize: 12, marginTop: 8 }}>Heard: "{inputText}"</div>}
          </div>
        )}

        {/* Camera mode */}
        {mode === 'camera' && (
          <div style={{ textAlign: 'center' }}>
            <video ref={videoRef} style={{ width: '100%', borderRadius: 10, maxHeight: 200, objectFit: 'cover', background: '#000' }} playsInline muted />
            <canvas ref={canvasRef} style={{ display: 'none' }} />
            {status !== 'result' && (
              <button onClick={handleCameraCapture}
                style={{ marginTop: 12, background: T.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '10px 28px', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
                📸 Capture & Translate
              </button>
            )}
          </div>
        )}

        {/* Type mode */}
        {mode === 'type' && (
          <div>
            <textarea
              value={inputText}
              onChange={e => setInputText(e.target.value)}
              placeholder={settings.nativeLang === 'zh-TW' ? '輸入中文...' : 'Type in English...'}
              rows={3}
              style={{ width: '100%', background: T.surface2, border: `1px solid ${T.border}`, borderRadius: 10, padding: '10px 12px', color: T.text, fontSize: 14, outline: 'none', resize: 'none', boxSizing: 'border-box' }}
            />
            <button onClick={handleTypeSubmit}
              style={{ marginTop: 8, width: '100%', background: T.accent, color: '#fff', border: 'none', borderRadius: 10, padding: '11px 0', cursor: 'pointer', fontSize: 14, fontWeight: 600 }}>
              Translate →
            </button>
          </div>
        )}

        {/* Loading */}
        {status === 'loading' && <div style={{ textAlign: 'center', color: T.muted, padding: '16px 0', fontSize: 13 }}>Translating...</div>}

        {/* Error */}
        {status === 'error' && <div style={{ color: '#ef4444', fontSize: 13, textAlign: 'center', marginTop: 12 }}>{errorMsg}</div>}

        {/* Result */}
        {status === 'result' && (
          <div style={{ marginTop: 16, background: T.surface2, borderRadius: 12, padding: '14px 16px' }}>
            <div style={{ color: T.muted, fontSize: 11, marginBottom: 6 }}>Japanese</div>
            <div style={{ fontFamily: "'Noto Sans JP', sans-serif", fontSize: 22, fontWeight: 700, color: T.text, marginBottom: 12 }}>{resultJapanese}</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={handleSave}
                style={{ flex: 1, background: T.accent, color: '#fff', border: 'none', borderRadius: 8, padding: '9px 0', cursor: 'pointer', fontSize: 13, fontWeight: 600 }}>
                ＋ Save phrase
              </button>
              <button onClick={() => { setStatus('idle'); setInputText(''); setResultJapanese('') }}
                style={{ background: T.surface, color: T.muted, border: `1px solid ${T.border}`, borderRadius: 8, padding: '9px 14px', cursor: 'pointer', fontSize: 13 }}>
                Clear
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  )
}
