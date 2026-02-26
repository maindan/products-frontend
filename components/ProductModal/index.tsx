"use client"

import { useMemo, useState } from "react"
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
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select"
import { Trash, Plus, PackagePlus, ListChecks, Info } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"

import { useMaterials, useCreateMaterial } from "@/src/hooks/useMaterial"
import { useCreateProduct, useUpdateProduct } from "@/src/hooks/useProduct"
import { ProductWithMaterials, ProductCreateRequest } from "@/src/types/product"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Material } from "@/src/types/material"

interface Props {
  open: boolean
  onClose: () => void
  product?: ProductWithMaterials | null
}

interface ProductFormState {
  code: string
  name: string
  price: number
  materials: { materialId: string; quantityRequired: number }[]
}

export function ProductModal({ open, onClose, product }: Props) {
  const isEdit = !!product
  const { data: materials } = useMaterials()
  const { mutateAsync: createMaterial } = useCreateMaterial()
  const { mutateAsync: createProduct, isPending: creating } = useCreateProduct()
  const { mutateAsync: updateProduct, isPending: updating } = useUpdateProduct()

  const [form, setForm] = useState<ProductFormState>(() => ({
    code: product?.code ?? "",
    name: product?.name ?? "",
    price: product?.price ? Number(product.price) : 0,
    materials: product?.materials.map((m) => ({
      materialId: m.materialId,
      quantityRequired: Number(m.quantityRequired),
    })) ?? [],
  }))

  const [showQuickAdd, setShowQuickAdd] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [newMat, setNewMat] = useState({ name: "", code: "", stock: 0 })
  const [error, setError] = useState<string | null>(null)

  const loading = creating || updating

  const materialMap = useMemo(() => 
    Object.fromEntries((materials ?? []).map((m) => [m.id, m])), 
  [materials])

  function updateField<K extends keyof ProductFormState>(field: K, value: ProductFormState[K]) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function addMaterial(materialId: string) {
    if (form.materials.some((i) => i.materialId === materialId)) return
    updateField("materials", [...form.materials, { materialId, quantityRequired: 1 }])
  }

  async function handleQuickCreateMaterial() {
    if (!newMat.name || !newMat.code) return
    try {
      const created = await createMaterial({
        name: newMat.name,
        code: newMat.code,
        stockQuantity: newMat.stock,
      }) as Material
      addMaterial(created.id)
      setNewMat({ name: "", code: "", stock: 0 })
      setShowQuickAdd(false)
    } catch {
      setError("Erro ao criar insumo.")
    }
  }

  const executeSave = async () => {
    const body: ProductCreateRequest = {
      code: form.code,
      name: form.name,
      price: form.price,
      materials: form.materials,
    }

    try {
      if (isEdit && product) {
        await updateProduct({ id: product.id, body })
      } else {
        await createProduct(body)
      }
      onClose()
    } catch {
      setError("Erro ao salvar produto.")
    }
  }

  async function handleSubmit() {
    if (!form.code || !form.name || form.price <= 0) return setError("Preencha os dados obrigatórios.")
    if (form.materials.length === 0) return setError("Adicione ao menos um insumo.")

    if (isEdit) {
      setShowConfirm(true)
    } else {
      await executeSave()
    }
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="max-w-2xl flex flex-col max-h-[90vh] gap-0 p-0">
          <DialogHeader className="p-6 pb-2">
            <DialogTitle className="text-xl flex items-center gap-2">
              {isEdit ? "Editar Produto" : "Novo Produto"}
              {isEdit && <Badge variant="secondary">Modo Edição</Badge>}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 px-6 overflow-y-auto">
            <div className="space-y-6 pb-6">
              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="col-span-2 space-y-2">
                  <Label htmlFor="name">Nome do Produto</Label>
                  <Input 
                    id="name"
                    value={form.name} 
                    onChange={(e) => updateField("name", e.target.value)}
                    placeholder="Nome identificador do produto"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="code">Código SKU</Label>
                  <Input 
                    id="code"
                    value={form.code} 
                    onChange={(e) => updateField("code", e.target.value)}
                    placeholder="Ex: PROD-123"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="price">Preço de Venda (R$)</Label>
                  <Input 
                    id="price"
                    type="number" 
                    value={form.price} 
                    onChange={(e) => updateField("price", Number(e.target.value))}
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    <ListChecks className="w-4 h-4" /> 
                    Composição do Produto
                  </div>
                  <Button 
                    type="button" 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 text-primary"
                    onClick={() => setShowQuickAdd(!showQuickAdd)}
                  >
                    <PackagePlus className="w-4 h-4 mr-2" />
                    {showQuickAdd ? "Cancelar" : "Novo Insumo"}
                  </Button>
                </div>

                {showQuickAdd && (
                  <div className="bg-muted/50 border rounded-lg p-4 space-y-3 animate-in fade-in zoom-in-95 duration-200">
                    <div className="flex items-center gap-2 text-xs font-bold text-primary italic">
                      <Info className="w-3 h-3" /> Cadastrar novo insumo no sistema
                    </div>
                    <div className="flex gap-2">
                      <Input placeholder="Nome" value={newMat.name} onChange={e => setNewMat({...newMat, name: e.target.value})} className="bg-background" />
                      <Input placeholder="Código" value={newMat.code} onChange={e => setNewMat({...newMat, code: e.target.value})} className="bg-background w-32" />
                      <Button onClick={handleQuickCreateMaterial} size="icon" className="shrink-0"><Plus className="w-4 h-4" /></Button>
                    </div>
                  </div>
                )}

                <div className="space-y-3">
                  <Select onValueChange={addMaterial}>
                    <SelectTrigger className="w-full bg-muted/30">
                      <SelectValue placeholder="Pesquisar e adicionar insumo existente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {materials?.map((m) => (
                        <SelectItem key={m.id} value={m.id}>{m.name} ({m.code})</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <div className="border rounded-lg">
                    <div className="grid grid-cols-[1fr_120px_40px] gap-2 p-2 bg-muted/50 rounded-t-lg text-xs font-bold uppercase text-muted-foreground">
                      <span className="pl-2">Insumo</span>
                      <span className="text-center">Qtd. Necessária</span>
                      <span></span>
                    </div>
                    <div className="divide-y max-h-64 overflow-y-auto">
                      {form.materials.length === 0 ? (
                        <div className="p-8 text-center text-sm text-muted-foreground italic">
                          Nenhum insumo adicionado a este produto.
                        </div>
                      ) : (
                        form.materials.map((item) => (
                          <div key={item.materialId} className="grid grid-cols-[1fr_120px_40px] items-center gap-2 p-2 hover:bg-muted/20 transition-colors">
                            <div className="pl-2">
                              <p className="text-sm font-medium leading-none">{materialMap[item.materialId]?.name}</p>
                              <p className="text-[10px] text-muted-foreground mt-1 uppercase">{materialMap[item.materialId]?.code}</p>
                            </div>
                            <Input 
                              type="number" 
                              className="h-8 text-center"
                              value={item.quantityRequired}
                              onChange={(e) => {
                                const newList = form.materials.map(m => 
                                  m.materialId === item.materialId ? { ...m, quantityRequired: Number(e.target.value) } : m
                                )
                                updateField("materials", newList)
                              }}
                            />
                            <Button 
                              variant="ghost" 
                              size="icon" 
                              className="h-8 w-8 text-destructive"
                              onClick={() => updateField("materials", form.materials.filter(m => m.materialId !== item.materialId))}
                            >
                              <Trash className="w-4 h-4" />
                            </Button>
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </ScrollArea>

          <Separator />

          <DialogFooter className="p-6 bg-muted/10">
            {error && <p className="text-xs text-destructive font-medium mr-auto self-center">{error}</p>}
            <div className="flex gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={onClose} disabled={loading} className="flex-1 sm:flex-none">Cancelar</Button>
              <Button onClick={handleSubmit} disabled={loading} className="flex-1 sm:flex-none">
                {loading ? "Processando..." : isEdit ? "Salvar Alterações" : "Criar Produto"}
              </Button>
            </div>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <ConfirmDialog 
        open={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={executeSave}
        title="Confirmar Edição"
        description="Você tem certeza que deseja salvar as alterações feitas neste produto?"
        confirmText="Salvar Alterações"
      />
    </>
  )
}