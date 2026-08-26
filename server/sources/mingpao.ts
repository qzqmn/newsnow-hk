const categories = {
  hongkong: "https://news.mingpao.com/rss/ins/s00001.xml",
  china: "https://news.mingpao.com/rss/ins/s00002.xml",
  international: "https://news.mingpao.com/rss/ins/s00003.xml",
  finance: "https://news.mingpao.com/rss/ins/s00004.xml",
  sports: "https://news.mingpao.com/rss/ins/s00005.xml",
  entertainment: "https://news.mingpao.com/rss/ins/s00006.xml",
} as const

async function fetchMingpao(category: string) {
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
  "mingpao": () => fetchMingpao("hongkong"),
  "mingpao-hongkong": () => fetchMingpao("hongkong"),
  "mingpao-china": () => fetchMingpao("china"),
  "mingpao-international": () => fetchMingpao("international"),
  "mingpao-finance": () => fetchMingpao("finance"),
  "mingpao-sports": () => fetchMingpao("sports"),
  "mingpao-entertainment": () => fetchMingpao("entertainment"),
})
