export default function readingTime(text: string, wordsPerMinute = 200) {
  const words = text.split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}
