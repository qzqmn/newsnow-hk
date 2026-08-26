const categories = {
  hongkong: "https://www.hket.com/rss/hongkong",
  finance: "https://www.hket.com/rss/finance",
  china: "https://www.hket.com/rss/china",
  international: "https://www.hket.com/rss/international",
  tech: "https://www.hket.com/rss/tech",
} as const

async function fetchHket(category: string) {
  const url = categories[category as keyof typeof categories]
  if (!url) return []
  const data = await rss2json(url)
  if (!data?.items.length) return []
  return data.items.map(item => ({
    id: item.link,
    title: item.title,
    url: item.link,
    pubDate: item.created,
  }))
}

export default defineSource({
  "hket": () => fetchHket("hongkong"),
  "hket-hongkong": () => fetchHket("hongkong"),
  "hket-finance": () => fetchHket("finance"),
  "hket-china": () => fetchHket("china"),
  "hket-international": () => fetchHket("international"),
  "hket-tech": () => fetchHket("tech"),
})
