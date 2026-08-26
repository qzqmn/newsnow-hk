const categories = {
  hongkong: "https://www.scmp.com/rss/91/feed",
  china: "https://www.scmp.com/rss/4/feed",
  asia: "https://www.scmp.com/rss/318321/feed",
  opinion: "https://www.scmp.com/rss/318203/feed",
  tech: "https://www.scmp.com/rss/36/feed",
} as const

async function fetchScmp(category: string) {
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
  "scmp": () => fetchScmp("hongkong"),
  "scmp-hongkong": () => fetchScmp("hongkong"),
  "scmp-china": () => fetchScmp("china"),
  "scmp-asia": () => fetchScmp("asia"),
  "scmp-opinion": () => fetchScmp("opinion"),
  "scmp-tech": () => fetchScmp("tech"),
})
