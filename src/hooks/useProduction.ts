import { useMutation } from "@tanstack/react-query"
import { apiFetch } from "@/src/lib/api"
import { ProductSuggestionResponse } from "@/src/types/product-suggestion"

export function useGenerateSuggestion() {
  return useMutation<ProductSuggestionResponse>({
    mutationFn: async () => {
      return apiFetch<ProductSuggestionResponse>(
        "/products/suggestion"
      )
    },
  })
}