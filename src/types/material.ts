export interface Material {
  id: string
  code: string
  name: string
  stockQuantity: number
}

export interface MaterialCreateRequest {
  code: string
  name: string
  stockQuantity: number
}

export interface MaterialUpdateRequest {
  code?: string
  name?: string
  stockQuantity?: number
}