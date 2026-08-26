const baseUrl = "https://news.google.com/rss"
const topics = {
  focus: "",
  business: "/headlines/section/topic/BUSINESS",
  technology: "/headlines/section/topic/TECHNOLOGY",
  sports: "/headlines/section/topic/SPORTS",
} as const

const suffix = "?hl=zh-HK&gl=HK&ceid=HK:zh-Hant"

async function fetchGoogleNews(topic: string) {
  const path = topics[topic as keyof typeof topics]
  if (path === undefined) return []
  const url = `${baseUrl}${path}${suffix}`
  const data = await rss2json(url)
  if (!data?.items.length) return []
  return data.items.map((item) => {
    let title = item.title || ""
    const dashIdx = title.lastIndexOf(" - ")
    if (dashIdx > 0) title = title.substring(0, dashIdx)
    return {
      id: item.link,
      title,
      url: item.link,
      pubDate: item.created,
    }
  })
}

export default defineSource({
  "googlenews-focus": () => fetchGoogleNews("focus"),
  "googlenews-business": () => fetchGoogleNews("business"),
  "googlenews-technology": () => fetchGoogleNews("technology"),
  "googlenews-sports": () => fetchGoogleNews("sports"),
})
