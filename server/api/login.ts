import process from "node:process"

export default defineEventHandler(async (event) => {
  const clientId = (process.env.G_CLIENT_ID || "").replace(/^\uFEFF/, "")
  sendRedirect(event, `https://github.com/login/oauth/authorize?client_id=${clientId}`)
})
