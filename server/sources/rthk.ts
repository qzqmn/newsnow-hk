const rthkBase = "https://rthk.hk/rthk/news/rss"
const categories = {
  local: "c_expressnews_clocal.xml",
  greaterchina: "c_expressnews_greaterchina.xml",
  world: "c_expressnews_cinternational.xml",
  finance: "c_expressnews_cfinance.xml",
  sport: "c_expressnews_csport.xml",
} as const

async function fetchRss(category: string) {
  const url = `${rthkBase}/${categories[category as keyof typeof categories]}`
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
  "rthk": () => fetchRss("local"),
  "rthk-local": () => fetchRss("local"),
  "rthk-greaterchina": () => fetchRss("greaterchina"),
  "rthk-world": () => fetchRss("world"),
  "rthk-finance": () => fetchRss("finance"),
  "rthk-sport": () => fetchRss("sport"),
})
