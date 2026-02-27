import { NextRequest } from "next/server"

const API_BASE = process.env.API_BASE_URL

if (!API_BASE) {
  throw new Error("API_BASE_URL não definida")
}

async function forwardRequest(
  req: NextRequest,
  method: string,
  path: string[]
) {
  const url = `${API_BASE}/${path.join("/")}${
    req.nextUrl.search
  }`

  const body =
    method !== "GET" && method !== "DELETE"
      ? await req.text()
      : undefined

  const response = await fetch(url, {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    body,
    cache: "no-store",
  })

  const data = await response.text()

  return new Response(data, {
    status: response.status,
    headers: {
      "Content-Type": "application/json",
    },
  })
}

type RouteContext = {
  params: Promise<{ path: string[] }>
}

export async function GET(
  req: NextRequest,
  context: RouteContext
) {
  const { path } = await context.params
  return forwardRequest(req, "GET", path)
}

export async function POST(
  req: NextRequest,
  context: RouteContext
) {
  const { path } = await context.params
  return forwardRequest(req, "POST", path)
}

export async function PUT(
  req: NextRequest,
  context: RouteContext
) {
  const { path } = await context.params
  return forwardRequest(req, "PUT", path)
}

export async function PATCH(
  req: NextRequest,
  context: RouteContext
) {
  const { path } = await context.params
  return forwardRequest(req, "PATCH", path)
}

export async function DELETE(
  req: NextRequest,
  context: RouteContext
) {
  const { path } = await context.params
  return forwardRequest(req, "DELETE", path)
}