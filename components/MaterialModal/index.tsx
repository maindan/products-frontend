"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCreateMaterial, useUpdateMaterial } from "@/src/hooks/useMaterial"
import { Material } from "@/src/types/material"
import { ConfirmDialog } from "@/components/ConfirmDialog"

interface MaterialModalProps {
  open: boolean
  onClose: () => void
  material?: Material | null
}

export function MaterialModal({ open, onClose, material }: MaterialModalProps) {
  const isEdit = !!material
  const { mutateAsync: createMaterial, isPending: isCreating } = useCreateMaterial()
  const { mutateAsync: updateMaterial, isPending: isUpdating } = useUpdateMaterial()

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    stockQuantity: 0,
  })

  const [showConfirm, setShowConfirm] = useState(false)

  useEffect(() => {
    if (material) {
      setFormData({
        name: material.name,
        code: material.code,
        stockQuantity: material.stockQuantity,
      })
    } else {
      setFormData({ name: "", code: "", stockQuantity: 0 })
    }
  }, [material, open])

  const handleSave = async () => {
    try {
      if (isEdit && material) {
        await updateMaterial({ id: material.id, data: formData })
      } else {
        await createMaterial(formData)
      }
      onClose()        
    } finally {
      setShowConfirm(false)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (isEdit) {
      setShowConfirm(true)
    } else {
      handleSave()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[425px]">
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>{isEdit ? "Editar Material" : "Novo Material"}</DialogTitle>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="name">Nome</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Ex: Alumínio"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="code">Código</Label>
                <Input
                  id="code"
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  placeholder="Ex: MT-001"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="stock">Quantidade em Estoque</Label>
                <Input
                  id="stock"
                  type="number"
                  value={formData.stockQuantity}
                  onChange={(e) => setFormData({ ...formData, stockQuantity: Number(e.target.value) })}
                  required
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
              <Button type="submit" disabled={isCreating || isUpdating}>
                {isEdit ? "Salvar Alterações" : "Criar Material"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={handleSave}
        title="Confirmar Edição"
        description="Deseja salvar as alterações feitas neste material?"
        confirmText="Salvar"
      />
    </>
  )
}