"use client"

import { useState, useMemo } from "react"
import { Plus, Search, Package, Pencil, Trash2, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { useProductsWithMaterials, useDeleteProduct } from "@/src/hooks/useProduct"
import { ProductModal } from "@/components/ProductModal"
import { ConfirmDialog } from "@/components/ConfirmDialog"
import { ProductWithMaterials } from "@/src/types/product"
import { useQueryClient } from "@tanstack/react-query"

export default function ProductsPage() {
  const queryClient = useQueryClient()
  const { data, isLoading } = useProductsWithMaterials()
  
  const { mutateAsync: deleteProduct } = useDeleteProduct()

  const [searchTerm, setSearchTerm] = useState("")
  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<ProductWithMaterials | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const filteredProducts = useMemo(() => {
    if (!data) return []
    return data.filter(p => 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.code.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [data, searchTerm])

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-2 bg-zinc-50">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium">Carregando produtos...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-zinc-50/50 p-6 md:p-10">
      <div className="max-w-5xl mx-auto space-y-8">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-zinc-900">Produtos</h1>
            <p className="text-muted-foreground text-sm">Gerencie seu catálogo e a composição técnica de cada item.</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full md:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nome ou código..."
                className="pl-9 bg-white shadow-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              onClick={() => {
                setSelectedProduct(null)
                setModalOpen(true)
              }}
              className="shadow-sm shrink-0"
            >
              <Plus className="mr-2 h-4 w-4" /> Novo Produto
            </Button>
          </div>
        </div>

        <Separator />

        <div className="grid gap-4">
          {filteredProducts.length === 0 ? (
            <Card className="border-dashed shadow-none bg-transparent">
              <CardContent className="flex flex-col items-center justify-center p-12 text-center">
                <div className="bg-zinc-100 p-4 rounded-full mb-4">
                  <Package className="h-10 w-10 text-zinc-400" />
                </div>
                <h3 className="font-semibold text-lg text-zinc-900">Nenhum produto encontrado</h3>
                <p className="text-muted-foreground max-w-xs mx-auto mb-6 text-sm">
                  {searchTerm 
                    ? `Não existem resultados para "${searchTerm}". Tente outro termo.` 
                    : "Sua lista está vazia. Comece adicionando o primeiro produto do seu catálogo."}
                </p>
                {!searchTerm && (
                  <Button variant="outline" onClick={() => setModalOpen(true)}>
                    Cadastrar Produto
                  </Button>
                )}
              </CardContent>
            </Card>
          ) : (
            filteredProducts.map((product) => (
              <Card key={product.id} className="group hover:border-primary/50 transition-all shadow-sm">
                <CardContent className="p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg text-zinc-900 leading-none">{product.name}</h3>
                      <Badge variant="secondary" className="text-[10px] font-mono px-1.5">
                        {product.code}
                      </Badge>
                    </div>
                    
                    <div className="flex items-center gap-3 text-sm">
                      <span className="font-bold text-primary italic">
                        {new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(Number(product.price))}
                      </span>
                      <span className="text-zinc-300">|</span>
                      <span className="flex items-center gap-1.5 text-zinc-500">
                        <Package className="h-3.5 w-3.5" />
                        {product.materials?.length || 0} Insumos vinculados
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <Button
                      variant="outline"
                      size="sm"
                      className="h-9 px-3 hover:bg-zinc-50"
                      onClick={() => {
                        setSelectedProduct(product)
                        setModalOpen(true)
                      }}
                    >
                      <Pencil className="mr-2 h-3.5 w-3.5" /> Editar
                    </Button>

                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-9 w-9 text-zinc-400 hover:text-destructive hover:bg-destructive/10"
                      onClick={() => setDeleteId(product.id)}
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

      <ProductModal
        key={selectedProduct?.id || "new"}
        open={modalOpen}
        onClose={() => {
          setModalOpen(false)
          setSelectedProduct(null)
          queryClient.invalidateQueries({ queryKey: ["products-with-materials"] })
        }}
        product={selectedProduct}
      />

      <ConfirmDialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
        onConfirm={async () => {
          if (deleteId) {
            await deleteProduct(deleteId)
            setDeleteId(null)
          }
        }}
        title="Confirmar exclusão"
        description="Tem certeza que deseja excluir este produto? Esta ação removerá permanentemente o item e seus vínculos de composição."
        confirmText="Excluir Produto"
      />
    </div>
  )
}