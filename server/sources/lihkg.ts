const LIHKG_API = "https://lihkg.com/api_v2"
const HEADERS = {
  "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36",
  "X-LIHKG-FCGBLE": "1",
  "Referer": "https://lihkg.com/",
}

const categories = {
  chat: { id: 1, name: "吹水台" },
  current: { id: 5, name: "時事台" },
  hobby: { id: 6, name: "興趣台" },
  sport: { id: 2, name: "體育台" },
  king: { id: 8, name: "吹水台 King" },
} as const

async function fetchLihkg(category: string) {
  const cat = categories[category as keyof typeof categories]
  if (!cat) return []
  const url = `${LIHKG_API}/thread/hot?cat_id=${cat.id}&page=1&count=30&type=now`
  const data = await myFetch(url, { headers: HEADERS })
  if (!data?.success || !data?.response?.items?.length) return []
  return data.response.items.map((item: any) => ({
    id: String(item.thread_id),
    title: item.title,
    url: `https://lihkg.com/thread/${item.thread_id}`,
    pubDate: item.last_reply_time ? item.last_reply_time * 1000 : item.create_time * 1000,
  }))
}

export default defineSource({
  "lihkg": () => fetchLihkg("chat"),
  "lihkg-chat": () => fetchLihkg("chat"),
  "lihkg-current": () => fetchLihkg("current"),
  "lihkg-hobby": () => fetchLihkg("hobby"),
  "lihkg-sport": () => fetchLihkg("sport"),
})
