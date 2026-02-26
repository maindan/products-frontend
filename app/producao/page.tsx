"use client"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { useGenerateSuggestion } from "@/src/hooks/useProduction"
import { 
  Sparkles, 
  RefreshCcw, 
  AlertCircle, 
  TrendingUp, 
  PackageCheck, 
  ChevronRight,
  ClipboardList
} from "lucide-react"

export default function ProducaoPage() {
  const { mutate, data, isPending, isError } = useGenerateSuggestion()

  const formatCurrency = (value: number) =>
    new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value)

  return (
    <div className="min-h-screen bg-zinc-50/50 py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-8">

        <Card className="border-none shadow-2xl bg-white/80 backdrop-blur-sm overflow-hidden pt-0">
          <CardHeader className="bg-zinc-900 text-white p-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/20 rounded-lg">
                <Sparkles className="w-6 h-6 text-primary" />
              </div>
              <div>
                <CardTitle className="text-xl">Inteligência de Estoque</CardTitle>
                <CardDescription className="text-zinc-400">
                  Algoritmo de otimização de recursos.
                </CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-8 space-y-8">
            {!data && !isPending && (
              <div className="py-12 text-center space-y-8 animate-in fade-in zoom-in-95">
                <div className="flex justify-center">
                  <div className="relative">
                    <ClipboardList className="w-20 h-20 text-zinc-200" />
                    <Sparkles className="w-8 h-8 text-primary absolute -top-2 -right-2 animate-pulse" />
                  </div>
                </div>
                
                <div className="max-w-sm mx-auto space-y-2">
                  <p className="text-zinc-600 font-medium">Pronto para otimizar?</p>
                  <p className="text-sm text-zinc-500">
                    O sistema analisará todos os insumos vinculados aos seus produtos para sugerir o volume máximo de produção viável hoje.
                  </p>
                </div>

                <Button
                  size="lg"
                  className="px-10 h-14 text-base rounded-full shadow-lg shadow-primary/20 transition-all hover:scale-105"
                  onClick={() => mutate()}
                >
                  Iniciar Análise
                  <ChevronRight className="ml-2 w-5 h-5" />
                </Button>
              </div>
            )}

            {isPending && (
              <div className="py-20 text-center space-y-6">
                <div className="relative inline-flex">
                  <RefreshCcw className="w-16 h-16 text-primary animate-spin" />
                </div>
                <div className="space-y-1">
                  <p className="text-lg font-semibold animate-pulse">Cruzando dados de insumos...</p>
                  <p className="text-sm italic text-zinc-500">Isso pode levar alguns segundos.</p>
                </div>
              </div>
            )}

            {isError && (
              <div className="p-6 rounded-2xl bg-red-50 border border-red-100 flex items-center gap-4 text-red-800 animate-in slide-in-from-top-4">
                <AlertCircle className="w-6 h-6 shrink-0" />
                <p className="text-sm font-medium">Ocorreu um erro ao processar os dados. Verifique a conexão com o servidor.</p>
                <Button variant="outline" size="sm" onClick={() => mutate()} className="ml-auto bg-white">Tentar novamente</Button>
              </div>
            )}

            {data && !isPending && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Valor Estimado em Venda</p>
                    <p className="text-3xl font-black text-primary">{formatCurrency(data.totalValue)}</p>
                  </div>
                  <div className="p-4 rounded-xl bg-zinc-50 border border-zinc-100 space-y-1">
                    <p className="text-xs text-zinc-500 uppercase font-bold tracking-wider">Itens Sugeridos</p>
                    <p className="text-3xl font-black text-zinc-900">{data.items.length} Produtos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-emerald-500" />
                    <h4 className="font-bold text-zinc-900">Plano de Produção Recomendado</h4>
                  </div>

                  <div className="grid gap-3">
                    {data.items.map((item) => (
                      <div
                        key={item.productId}
                        className="group flex items-center justify-between p-4 rounded-xl border border-zinc-100 bg-white hover:border-primary/50 transition-all hover:shadow-md"
                      >
                        <div className="flex items-center gap-4">
                          <div className="h-10 w-10 rounded-lg bg-zinc-100 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                            <PackageCheck className="w-5 h-5 text-zinc-400 group-hover:text-primary" />
                          </div>
                          <div>
                            <p className="font-bold text-zinc-800">{item.productName}</p>
                            <Badge variant="secondary" className="bg-emerald-50 text-emerald-700 border-emerald-100">
                              Produzir {item.quantity} unidades
                            </Badge>
                          </div>
                        </div>

                        <div className="text-right min-w-29">
                          <p className="font-mono font-bold text-zinc-900">{formatCurrency(item.productValue)}</p>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold">Valor Produto</p>
                        </div>

                        <div className="text-right min-w-29">
                          <p className="font-mono font-bold text-zinc-900">{formatCurrency(item.totalValue)}</p>
                          <p className="text-[10px] text-zinc-400 uppercase font-bold">Valor Total</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <Separator />

                <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-2">
                  <div className="flex items-center gap-2 text-zinc-500 text-sm italic">
                    <AlertCircle className="w-4 h-4" />
                    <span>Sugestão baseada no limite máximo de insumos.</span>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-zinc-500 hover:text-primary transition-colors"
                    onClick={() => mutate()}
                  >
                    <RefreshCcw className="mr-2 w-4 h-4" />
                    Recalcular Sugestão
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}