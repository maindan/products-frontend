const API_URL = "http://localhost:8080"

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || "Erro na requisição")
  }

  const contentType = response.headers.get("content-type")
  
  if (response.status === 204 || !contentType || !contentType.includes("application/json")) {
    return {} as T
  }

  const text = await response.text()
  return text ? JSON.parse(text) : ({} as T)
}