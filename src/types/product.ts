export interface ProductMaterialRequest {
  materialId: string
  quantityRequired: number
}

export interface Product {
  id: string
  code: string
  name: string
  price: number
}

export interface ProductWithMaterials extends Product {
  materials: {
    id: string
    materialId: string
    materialName: string
    quantityRequired: number
  }[]
}

export interface ProductCreateRequest {
  code: string
  name: string
  price: number
  materials: ProductMaterialRequest[]
}