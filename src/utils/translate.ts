import { recognize } from 'tesseract.js'

export interface TranslateResult {
  translatedText: string
  detectedSourceLanguage?: string
}

export async function translateText(
  text: string,
  targetLang: string = 'ja',
  sourceLang: string = 'en'
): Promise<TranslateResult> {
  const params = new URLSearchParams({
    q: text,
    langpair: `${sourceLang}|${targetLang}`,
  })
  const res = await fetch(`https://api.mymemory.translated.net/get?${params}`)
  if (!res.ok) throw new Error(`Translate API error: ${res.status}`)
  const data = await res.json()
  if (data.responseStatus !== 200) throw new Error(`Translate API error: ${data.responseStatus}`)
  return { translatedText: data.responseData.translatedText }
}

export async function ocrImage(base64Image: string, lang: string = 'eng+jpn'): Promise<string> {
  const imageData = base64Image.startsWith('data:')
    ? base64Image
    : `data:image/jpeg;base64,${base64Image}`
  const { data: { text } } = await recognize(imageData, lang)
  return text.trim()
}
