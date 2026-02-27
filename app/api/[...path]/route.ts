import { NextRequest } from "next/server"

const API_BASE = process.env.API_BASE_URL

if (!API_BASE) {
  throw new Error("API_BASE_URL não definida")
}

async function handler(
  req: NextRequest,
  method: string,
  path: string[],
) {
  const url = `${API_BASE}/${path.join("/")}`

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

export async function GET(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, "GET", params.path)
}

export async function POST(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, "POST", params.path)
}

export async function PUT(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, "PUT", params.path)
}

export async function PATCH(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, "PATCH", params.path)
}

export async function DELETE(
  req: NextRequest,
  { params }: { params: { path: string[] } }
) {
  return handler(req, "DELETE", params.path)
}