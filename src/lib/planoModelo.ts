import type { GrupoDre } from './types'

export interface ItemPlano {
  codigo: string
  nome: string
  tipo: 'receita' | 'despesa'
  grupo_dre: GrupoDre
}

// Plano de contas modelo (seed editavel). Copiado para cada empresa nova.
export const PLANO_MODELO: ItemPlano[] = [
  { codigo: '1.01', nome: 'Receitas de serviços', tipo: 'receita', grupo_dre: 'receita_bruta' },
  { codigo: '1.02', nome: 'Receitas de vendas', tipo: 'receita', grupo_dre: 'receita_bruta' },
  { codigo: '1.03', nome: 'Outras receitas', tipo: 'receita', grupo_dre: 'outras' },
  { codigo: '2.01', nome: 'Tributos sobre vendas', tipo: 'despesa', grupo_dre: 'deducoes' },
  { codigo: '3.01', nome: 'Custo dos serviços prestados', tipo: 'despesa', grupo_dre: 'custos' },
  { codigo: '3.02', nome: 'Custo das mercadorias vendidas', tipo: 'despesa', grupo_dre: 'custos' },
  { codigo: '4.01', nome: 'Despesas administrativas', tipo: 'despesa', grupo_dre: 'despesas_operacionais' },
  { codigo: '4.02', nome: 'Despesas com pessoal', tipo: 'despesa', grupo_dre: 'despesas_operacionais' },
  { codigo: '4.03', nome: 'Despesas comerciais', tipo: 'despesa', grupo_dre: 'despesas_operacionais' },
  { codigo: '4.04', nome: 'Tributos e taxas', tipo: 'despesa', grupo_dre: 'despesas_operacionais' },
  { codigo: '5.01', nome: 'Despesas financeiras', tipo: 'despesa', grupo_dre: 'despesas_financeiras' },
]
