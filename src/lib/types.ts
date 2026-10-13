export type Regime = 'simples' | 'presumido' | 'real' | 'mei'
export type Perfil = 'admin' | 'operador' | 'aprovador' | 'cliente'

interface Base {
  id: string
  created_at: string
  updated_at: string
}
export interface Empresa extends Base {
  razao_social: string
  nome_fantasia: string
  cnpj: string
  regime: Regime
  ativo: boolean
}
export interface Pessoa extends Base {
  empresa_id: string
  nome: string
  documento: string
  tipo: 'cliente' | 'fornecedor' | 'ambos'
  email: string
  telefone: string
  observacoes: string
}
export type GrupoDre =
  | 'receita_bruta'
  | 'deducoes'
  | 'custos'
  | 'despesas_operacionais'
  | 'despesas_financeiras'
  | 'outras'
export interface Categoria extends Base {
  empresa_id: string
  nome: string
  tipo: 'receita' | 'despesa'
  pai_id: string
  codigo: string
  grupo_dre: GrupoDre
}
export interface CentroCusto extends Base {
  empresa_id: string
  nome: string
  ativo: boolean
}
export interface Conta extends Base {
  empresa_id: string
  nome: string
  tipo: 'banco' | 'caixa' | 'cartao' | 'adquirente'
  banco: string
  saldo_inicial_centavos: number
  data_saldo_inicial: string
  ativo: boolean
}
