import { createContext, useContext, useState, type ReactNode } from 'react'
import { insert, list, type TableName } from './store'
import { PLANO_MODELO } from './planoModelo'
import type { Categoria, Empresa, Perfil } from './types'

interface Usuario {
  email: string
  perfil: Perfil
}
interface Ctx {
  usuario: Usuario | null
  empresaId: string
  setEmpresaId: (id: string) => void
  entrar: (email: string, senha: string) => string | null
  sair: () => void
}

const AuthCtx = createContext<Ctx | null>(null)
export const useAuth = () => {
  const c = useContext(AuthCtx)
  if (!c) throw new Error('AuthProvider ausente')
  return c
}

const USER_KEY = 'cubo.usuario'
const EMP_KEY = 'cubo.empresa'

export function criarEmpresa(data: Omit<Empresa, 'id' | 'created_at' | 'updated_at'>, copiarPlano: boolean): Empresa {
  const e = insert<Empresa>('fin_empresas' satisfies TableName, data)
  if (copiarPlano) {
    PLANO_MODELO.forEach((p) =>
      insert<Categoria>('fin_categorias', { ...p, empresa_id: e.id, pai_id: '' }),
    )
  }
  return e
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [usuario, setUsuario] = useState<Usuario | null>(() => {
    try {
      return JSON.parse(localStorage.getItem(USER_KEY) ?? 'null') as Usuario | null
    } catch {
      return null
    }
  })
  const [empresaId, setEmp] = useState(() => localStorage.getItem(EMP_KEY) ?? '')

  const setEmpresaId = (id: string) => {
    localStorage.setItem(EMP_KEY, id)
    setEmp(id)
  }

  // Login local de demonstracao. Sera trocado pelo Supabase Auth.
  const entrar = (email: string, senha: string) => {
    if (!email.includes('@')) return 'Informe um e-mail válido.'
    if (senha.length < 4) return 'A senha precisa ter ao menos 4 caracteres.'
    const u: Usuario = { email, perfil: 'admin' }
    localStorage.setItem(USER_KEY, JSON.stringify(u))
    setUsuario(u)
    if (!list<Empresa>('fin_empresas').length) {
      const e = criarEmpresa(
        { razao_social: 'Empresa Exemplo Ltda', nome_fantasia: 'Empresa Exemplo', cnpj: '', regime: 'simples', ativo: true },
        true,
      )
      setEmpresaId(e.id)
    }
    return null
  }
  const sair = () => {
    localStorage.removeItem(USER_KEY)
    setUsuario(null)
  }

  return <AuthCtx.Provider value={{ usuario, empresaId, setEmpresaId, entrar, sair }}>{children}</AuthCtx.Provider>
}
