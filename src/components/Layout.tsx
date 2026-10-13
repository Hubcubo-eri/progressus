import { NavLink, Outlet } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import Logo from './Logo'
import { useAuth } from '../lib/auth'
import { list } from '../lib/store'
import type { Empresa } from '../lib/types'

const MENU = [
  ['/', 'Painel'],
  ['/pagar', 'Contas a pagar'],
  ['/receber', 'Contas a receber'],
  ['/fluxo', 'Fluxo de caixa'],
  ['/conciliacao', 'Conciliação'],
  ['/relatorios', 'Relatórios'],
  ['/cadastros', 'Cadastros'],
  ['/fechamento', 'Fechamento'],
  ['/configuracoes', 'Configurações'],
] as const

export default function Layout() {
  const { usuario, sair, empresaId, setEmpresaId } = useAuth()
  const { data: empresas = [] } = useQuery({
    queryKey: ['fin_empresas', 'all'],
    queryFn: () => list<Empresa>('fin_empresas'),
  })
  const atual = empresas.find((e) => e.id === empresaId) ?? empresas[0]

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      <aside className="border-b border-neutral-100 p-4 md:w-56 md:border-b-0 md:border-r">
        <div className="mb-4 md:mb-8"><Logo /></div>
        <nav className="flex gap-1 overflow-x-auto md:flex-col">
          {MENU.map(([to, label]) => (
            <NavLink
              key={to}
              to={to}
              end={to === '/'}
              className={({ isActive }) =>
                `whitespace-nowrap rounded-xl px-3 py-2 text-sm ${isActive ? 'bg-cubo-soft font-medium text-cubo-dark' : 'text-neutral-600 hover:bg-neutral-50'}`
              }
            >
              {label}
            </NavLink>
          ))}
        </nav>
      </aside>
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-neutral-100 px-4 py-3 md:px-8">
          <select
            className="input max-w-xs"
            value={atual?.id ?? ''}
            onChange={(e) => setEmpresaId(e.target.value)}
            aria-label="Empresa"
          >
            {empresas.map((e) => (
              <option key={e.id} value={e.id}>{e.nome_fantasia || e.razao_social}</option>
            ))}
          </select>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="hidden sm:inline">{usuario?.email}</span>
            <button className="btn-ghost" onClick={sair}>Sair</button>
          </div>
        </header>
        <main className="flex-1 p-4 md:p-8"><Outlet /></main>
        <footer className="px-8 py-4 text-xs text-neutral-400">Cubo. BPO Financeiro, Maceió/AL</footer>
      </div>
    </div>
  )
}
