export type ProductSuggestionItem = {
  productId: string
  productName: string
  quantity: number
  productValue: number
  totalValue: number
}

export type ProductSuggestionResponse = {
  items: ProductSuggestionItem[]
  totalValue: number
}