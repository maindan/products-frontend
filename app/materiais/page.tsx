"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Boxes, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useMaterials, useDeleteMaterial } from "@/src/hooks/useMaterial"
import { MaterialModal } from "@/components/MaterialModal"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { Material } from "@/src/types/material"

export default function MaterialsPage() {
  const { data, isLoading } = useMaterials()
  const { mutateAsync: deleteMaterial } = useDeleteMaterial()

  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedMaterial, setSelectedMaterial] = useState<Material | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredMaterials = useMemo(() => {
    if (!data) return []
    return data.filter(m => 
      m.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      m.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Carregando insumos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Materiais</h1>
            <p className="text-muted-foreground text-sm">Gerencie o estoque de insumos e matérias-primas.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar insumo..."
                className="pl-9 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedMaterial(null)
                setModalOpen(true)
              }}
              className="shadow-sm shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Material
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          {filteredMaterials.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-zinc-100 p-4 rounded-full mb-4">
                  <Boxes className="h-10 w-10 text-zinc-400" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900">Nenhum material encontrado</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mb-6 text-sm">
                  {searchTerm 
                    ? `Não existem resultados para "${searchTerm}".` 
                    : "Sua lista de insumos está vazia."}
                </p>
                {!searchTerm && (
                  <Button variant="outline" onClick={() => setModalOpen(true)}>
                    Cadastrar Material
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredMaterials.map((material) => (
              <Card key={material.id} className="group hover:border-primary/50 transition-all shadow-sm">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg text-zinc-900 leading-none">{material.name}</h3>
                      <Badge variant="secondary" className="text-[10px] font-mono px-1.5">
                        {material.code}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <span className={`font-bold flex items-center gap-1.5 ${material.stockQuantity <= 5 ? 'text-red-600' : 'text-zinc-700'}`}>
                        Estoque: {material.stockQuantity}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 hover:bg-zinc-50"
                      onClick={() => {
                        setSelectedMaterial(material)
                        setModalOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-zinc-400 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(material.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>

      <MaterialModal
        key={selectedMaterial?.id || "new-material"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedMaterial(null)
        }}
        material={selectedMaterial}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteMaterial(deleteId)
            setDeleteId(null)
          }
        }}
        title="Excluir Material"
        description="Tem certeza que deseja excluir este insumo? Isso pode afetar produtos que dependem dele."
        confirmText="Excluir"
      />
    </div>
  )
}