import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { 
  ArrowRight, 
  Package, 
  Boxes, 
  Settings2, 
  TrendingUp, 
  CheckCircle2 
} from "lucide-react"

export default function Home() {
  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex items-center justify-center overflow-hidden bg-zinc-50 px-6">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full max-w-7xl pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="grid lg:grid-cols-2 gap-16 max-w-7xl w-full items-center relative z-10 py-12">
        <div className="space-y-8">
          <Badge 
            variant="outline" 
            className="px-4 py-1.5 border-primary/20 bg-primary/5 text-primary text-sm font-medium"
          >
            ✨ Gestão Inteligente de Estoque
          </Badge>

          <div className="space-y-4">
            <h1 className="text-5xl md:text-6xl font-extrabold leading-[1.1] tracking-tight text-zinc-900">
              Controle total com o{" "}
              <span className="bg-clip-text text-transparent bg-linear-to-r from-primary to-primary/60">
                Product Manager
              </span>
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
              Simplifique sua logística. Visualize materiais, gerencie produtos e otimize sua produção com sugestões automáticas baseadas em dados reais.
            </p>
          </div>

          <div className="flex gap-4 flex-wrap">
            <Link href="/producao">
              <Button size="lg" className="h-14 px-8 text-base shadow-lg shadow-primary/20 transition-all hover:scale-[1.02]">
                Sugestão de Produção
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>

            <Link href="/produtos">
              <Button variant="outline" size="lg" className="h-14 px-8 text-base bg-white/50 backdrop-blur-sm transition-all hover:bg-white">
                Explorar Catálogo
              </Button>
            </Link>
          </div>

          <div className="pt-8 flex gap-8 border-t border-zinc-200">
            <div>
              <p className="text-2xl font-bold text-zinc-900">100%</p>
              <p className="text-sm text-muted-foreground">Visibilidade</p>
            </div>
            <div className="w-px h-10 bg-zinc-200" />
            <div>
              <p className="text-2xl font-bold text-zinc-900">Auto</p>
              <p className="text-sm text-muted-foreground">Otimização</p>
            </div>
          </div>
        </div>

        <div className="relative group">
          <div className="absolute -inset-1 bg-linear-to-r from-primary/20 to-zinc-200 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-1000" />
          
          <Card className="relative shadow-2xl border-zinc-200/50 bg-white/80 backdrop-blur-xl rounded-2xl overflow-hidden">
            <CardContent className="p-8 space-y-8">
              <div className="space-y-2">
                <h3 className="font-bold text-xl text-zinc-900">
                  Potencialize sua operação
                </h3>
                <p className="text-sm text-muted-foreground">
                  Funcionalidades desenhadas para eficiência máxima.
                </p>
              </div>

              <div className="grid gap-6">
                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-blue-500/10 p-2 rounded-lg text-blue-600">
                    <Boxes className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Gestão de Insumos</h4>
                    <p className="text-sm text-muted-foreground italic leading-snug">Controle granular de cada matéria-prima.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-orange-500/10 p-2 rounded-lg text-orange-600">
                    <Package className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Catálogo de Produtos</h4>
                    <p className="text-sm text-muted-foreground italic leading-snug">Fichas técnicas e composições detalhadas.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-primary/10 p-2 rounded-lg text-primary">
                    <Settings2 className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Engenharia de Produção</h4>
                    <p className="text-sm text-muted-foreground italic leading-snug">Defina vínculos inteligentes entre materiais.</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="mt-1 bg-emerald-500/10 p-2 rounded-lg text-emerald-600">
                    <TrendingUp className="h-5 w-5" />
                  </div>
                  <div>
                    <h4 className="font-semibold text-zinc-900">Inteligência de Dados</h4>
                    <p className="text-sm text-muted-foreground italic leading-snug">Sugestões automáticas baseadas no estoque real.</p>
                  </div>
                </div>
              </div>

              <div className="pt-4 space-y-3">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Interface intuitiva e responsiva</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  <span>Sincronização em tempo real</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}