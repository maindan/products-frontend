import { useQuery, useMutation, useQueryClient, UseMutationOptions } from "@tanstack/react-query"
import { apiFetch } from "@/src/lib/api"
import { toast } from "sonner"
import {
  Material,
  MaterialCreateRequest,
  MaterialUpdateRequest,
} from "@/src/types/material"

export function useMaterials() {
  return useQuery({
    queryKey: ["materials"],
    queryFn: () => apiFetch<Material[]>("/materials"),
  })
}

export function useMaterial(id?: string) {
  return useQuery({
    queryKey: ["material", id],
    queryFn: () => apiFetch<Material>(`/materials/${id}`),
    enabled: !!id,
  })
}

export function useCreateMaterial(options?: UseMutationOptions<unknown, Error, MaterialCreateRequest, unknown>) {
  const qc = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (data: MaterialCreateRequest) =>
      apiFetch<unknown>("/materials", {
        method: "POST",
        body: JSON.stringify(data),
      }),
    onSuccess: async (...args) => {
      await qc.invalidateQueries({ queryKey: ["materials"] })
      toast.success("Material criado com sucesso!")
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      toast.error("Erro ao criar material")
      options?.onError?.(...args)
    },
  })
}

export function useUpdateMaterial(options?: UseMutationOptions<unknown, Error, { id: string; data: MaterialUpdateRequest }, unknown>) {
  const qc = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: ({ id, data }) =>
      apiFetch<unknown>(`/materials/${id}`, {
        method: "PUT",
        body: JSON.stringify(data),
      }),
    onSuccess: async (data, variables, context, ...args) => {
      await Promise.all([
        qc.invalidateQueries({ queryKey: ["materials"] }),
        qc.invalidateQueries({ queryKey: ["material", variables.id] }),
      ])
      toast.success("Material atualizado com sucesso!")
      options?.onSuccess?.(data, variables, context, ...args)
    },
    onError: (...args) => {
      toast.error("Erro ao atualizar material")
      options?.onError?.(...args)
    },
  })
}

export function useDeleteMaterial(options?: UseMutationOptions<unknown, Error, string, unknown>) {
  const qc = useQueryClient()

  return useMutation({
    ...options,
    mutationFn: (id: string) =>
      apiFetch<unknown>(`/materials/${id}`, {
        method: "DELETE",
      }),
    onSuccess: async (...args) => {
      await qc.invalidateQueries({ queryKey: ["materials"] })
      toast.success("Material excluído com sucesso!")
      options?.onSuccess?.(...args)
    },
    onError: (...args) => {
      toast.error("Erro ao excluir material")
      options?.onError?.(...args)
    },
  })
}