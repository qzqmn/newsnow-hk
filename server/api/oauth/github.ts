import process from "node:process"
import { SignJWT } from "jose"
import { UserTable } from "#/database/user"

const trimBom = (s: string) => s?.replace(/^\uFEFF/, "") || ""

export default defineEventHandler(async (event) => {
  const db = useDatabase()
  const userTable = db ? new UserTable(db) : undefined
  if (!userTable) throw new Error("db is not defined")
  if (process.env.INIT_TABLE !== "false") await userTable.init()

  const clientId = trimBom(process.env.G_CLIENT_ID)
  const clientSecret = trimBom(process.env.G_CLIENT_SECRET)
  const jwtSecret = trimBom(process.env.JWT_SECRET)

  const response: {
    access_token: string
    token_type: string
    scope: string
  } = await myFetch(
    `https://github.com/login/oauth/access_token`,
    {
      method: "POST",
      body: {
        client_id: clientId,
        client_secret: clientSecret,
        code: getQuery(event).code,
      },
      headers: {
        accept: "application/json",
      },
    },
  )

  const userInfo: {
    id: number
    name: string
    avatar_url: string
    email: string
    notification_email: string
  } = await myFetch(`https://api.github.com/user`, {
    headers: {
      "Accept": "application/vnd.github+json",
      "Authorization": `token ${response.access_token}`,
      "User-Agent": "NewsNow App",
    },
  })

  const userID = String(userInfo.id)
  await userTable.addUser(userID, userInfo.notification_email || userInfo.email, "github")

  const jwtToken = await new SignJWT({
    id: userID,
    type: "github",
  })
    .setExpirationTime("60d")
    .setProtectedHeader({ alg: "HS256" })
    .sign(new TextEncoder().encode(jwtSecret))

  const params = new URLSearchParams({
    login: "github",
    jwt: jwtToken,
    user: JSON.stringify({
      avatar: userInfo.avatar_url,
      name: userInfo.name,
    }),
  })
  return sendRedirect(event, `/?${params.toString()}`)
})
