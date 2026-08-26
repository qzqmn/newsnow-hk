const hkoApi = "https://data.weather.gov.hk/weatherAPI/opendata/weather.php"
const warningNames: Record<string, string> = {
  WTCSGNL: "熱帶氣旋警報",
  WRAINY: "黑色暴雨警告",
  WRAINR: "紅色暴雨警告",
  WRAIN: "黃色暴雨警告",
  WFIRE: "火災危險警告",
  WFROST: "霜凍警告",
  WL: "雷暴警告",
  WTS: "山泥傾瀉警告",
  WMSGNL: "沒有報告",
}

export default defineSource(async () => {
  const items: NewsItem[] = []

  try {
    const res: any = await myFetch(`${hkoApi}?dataType=warningInfo&lang=tc`)
    if (res.details?.length) {
      for (const w of res.details) {
        const code = w.warningStatementCode || w.warningCode || ""
        items.push({
          id: `hko-w-${code}`,
          title: `⚠️ ${warningNames[code] || code}`,
          url: "https://www.hko.gov.hk/tc/warn/warning.htm",
          pubDate: w.updateTime ? new Date(w.updateTime).valueOf() : undefined,
        })
      }
    }
  } catch {}

  try {
    const flw: any = await myFetch(`${hkoApi}?dataType=flw&lang=tc`)
    const now = new Date().valueOf()

    if (flw.forecastDesc) {
      items.push({
        id: "hko-forecast-today",
        title: `🌤 今日天氣：${flw.forecastDesc.substring(0, 80)}`,
        url: "https://www.hko.gov.hk/tc/index.html",
        pubDate: now,
      })
    }

    if (flw.tcInfo) {
      items.push({
        id: "hko-tcinfo",
        title: `🌀 ${flw.tcInfo}`,
        url: "https://www.hko.gov.hk/tc/wxwarntc.htm",
        pubDate: now,
      })
    }

    if (flw.outlook) {
      items.push({
        id: "hko-outlook",
        title: `展望：${flw.outlook}`,
        url: "https://www.hko.gov.hk/tc/index.html",
        pubDate: now,
      })
    }
  } catch {}

  return items
})
