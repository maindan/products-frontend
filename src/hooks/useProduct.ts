import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query"
import { apiFetch } from "@/src/lib/api"
import { toast } from "sonner"
import {
  Product,
  ProductWithMaterials,
  ProductCreateRequest,
} from "@/src/types/product"

export function useProduct() {
  return useQuery({
    queryKey: ["products"],
    queryFn: () =>
      apiFetch<Product[]>("/products"),
  })
}

export function useProductsWithMaterials() {
  return useQuery({
    queryKey: ["products-with-materials"],
    queryFn: () =>
      apiFetch<ProductWithMaterials[]>("/products/with-materials"),
  })
}

export function useCreateProduct(options?: UseMutationOptions<unknown, Error, ProductCreateRequest, unknown>) {
  const qc = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: ProductCreateRequest) =>
      apiFetch<unknown>("/products", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: async (...args) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["products"] }),
        qc.invalidateQueries({ queryKey: ["products-with-materials"] })
      ])
      toast.success("Produto criado com sucesso!")
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      toast.error("Erro ao criar produto")
      options?.onError?.(...args)
    }
  })
}

export function useUpdateProduct(options?: UseMutationOptions<unknown, Error, { id: string; body: ProductCreateRequest }, unknown>) {
  const qc = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({
      id,
      body,
    }: {
      id: string
      body: ProductCreateRequest
    }) =>
      apiFetch<unknown>(`/products/${id}`, {
        method: "PUT",
        body: JSON.stringify(body),
      }),
    onSuccess: async (...args) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["products"] }),
        qc.invalidateQueries({ queryKey: ["products-with-materials"] })
      ])
      toast.success("Produto atualizado com sucesso!")
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      toast.error("Erro ao atualizar produto")
      options?.onError?.(...args)
    }
  })
}

export function useDeleteProduct(options?: UseMutationOptions<unknown, Error, string, unknown>) {
  const qc = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: string) =>
      apiFetch<unknown>(`/products/${id}`, {
        method: "DELETE",
      }),
    onSuccess: async (...args) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["products"] }),
        qc.invalidateQueries({ queryKey: ["products-with-materials"] })
      ])
      toast.success("Produto excluído com sucesso!")
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      toast.error("Erro ao excluir produto")
      options?.onError?.(...args)
    }
  })
}