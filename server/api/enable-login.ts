import process from "node:process"

export default defineEventHandler(async () => {
  const clientId = (process.env.G_CLIENT_ID || "").replace(/^\uFEFF/, "")
  return {
    enable: true,
    url: `https://github.com/login/oauth/authorize?client_id=${clientId}`,
  }
})
