import { describe, it, expect, vi, beforeEach } from 'vitest'
import { translateText, ocrImage } from '../translate'

vi.mock('tesseract.js', () => ({ recognize: vi.fn() }))
import { recognize } from 'tesseract.js'

const mockFetch = vi.fn()
global.fetch = mockFetch

describe('translateText', () => {
  beforeEach(() => mockFetch.mockReset())

  it('calls MyMemory API and returns translated text', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        responseData: { translatedText: 'すみません', match: 1 },
        responseStatus: 200,
      }),
    })
    const result = await translateText('不好意思', 'ja', 'zh-TW')
    expect(result.translatedText).toBe('すみません')
    expect(mockFetch).toHaveBeenCalledWith(
      expect.stringContaining('api.mymemory.translated.net')
    )
  })

  it('includes langpair in request URL', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responseData: { translatedText: 'hello' }, responseStatus: 200 }),
    })
    await translateText('test', 'ja', 'en')
    expect(mockFetch).toHaveBeenCalledWith(expect.stringContaining('langpair=en%7Cja'))
  })

  it('throws on non-OK HTTP response', async () => {
    mockFetch.mockResolvedValueOnce({ ok: false, status: 403 })
    await expect(translateText('test', 'ja')).rejects.toThrow('Translate API error: 403')
  })

  it('throws on API error status in body', async () => {
    mockFetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ responseData: { translatedText: '' }, responseStatus: 429 }),
    })
    await expect(translateText('test', 'ja')).rejects.toThrow('Translate API error: 429')
  })
})

describe('ocrImage', () => {
  beforeEach(() => vi.mocked(recognize).mockReset())

  it('returns extracted text trimmed', async () => {
    vi.mocked(recognize).mockResolvedValueOnce({ data: { text: 'メニュー\n' } } as never)
    expect(await ocrImage('base64data')).toBe('メニュー')
  })

  it('returns empty string when no text detected', async () => {
    vi.mocked(recognize).mockResolvedValueOnce({ data: { text: '' } } as never)
    expect(await ocrImage('base64data')).toBe('')
  })

  it('wraps plain base64 in jpeg data URL', async () => {
    vi.mocked(recognize).mockResolvedValueOnce({ data: { text: 'hello' } } as never)
    await ocrImage('rawbase64')
    expect(recognize).toHaveBeenCalledWith('data:image/jpeg;base64,rawbase64', 'eng+jpn')
  })

  it('passes data URL directly without double-wrapping', async () => {
    vi.mocked(recognize).mockResolvedValueOnce({ data: { text: 'hello' } } as never)
    await ocrImage('data:image/png;base64,abc123')
    expect(recognize).toHaveBeenCalledWith('data:image/png;base64,abc123', 'eng+jpn')
  })
})
