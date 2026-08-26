export default defineSource(async () => {
  const html: string = await myFetch("https://www.hk01.com/", {
    responseType: "text",
  })

  const match = html.match(/<script id="__NEXT_DATA__"[^>]*>(\{[^<]+\})<\/script>/)
  if (!match) return []

  const data = JSON.parse(match[1])
  const sections = data?.props?.pageProps?.sections
  if (!sections) return []

  const articles: { id: string, title: string, url: string, publishTime: number }[] = []

  for (const sec of sections) {
    for (const item of sec.items ?? []) {
      const d = item.data
      if (d?.articleId && d?.title) {
        const id = String(d.articleId)
        if (!articles.some(a => a.id === id)) {
          articles.push({
            id,
            title: d.title,
            url: `https://www.hk01.com/article/${id}`,
            publishTime: d.publishTime ? d.publishTime * 1000 : 0,
          })
        }
      }
    }
  }

  return articles
    .sort((a, b) => (b.publishTime ?? 0) - (a.publishTime ?? 0))
    .slice(0, 30)
    .map(({ publishTime, ...rest }) => ({
      ...rest,
      pubDate: publishTime || undefined,
    }))
})
