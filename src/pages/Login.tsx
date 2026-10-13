import { useState } from 'react'
import Logo from '../components/Logo'
import { useAuth } from '../lib/auth'

export default function Login() {
  const { entrar } = useAuth()
  const [email, setEmail] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState<string | null>(null)

  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <form
        className="card w-full max-w-sm space-y-4 p-8"
        onSubmit={(e) => {
          e.preventDefault()
          setErro(entrar(email, senha))
        }}
      >
        <div className="text-center"><Logo className="text-3xl" /></div>
        <p className="text-center text-sm text-neutral-500">Gestão financeira para o seu negócio</p>
        <input className="input" type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input className="input" type="password" placeholder="Senha" value={senha} onChange={(e) => setSenha(e.target.value)} />
        {erro && <p className="text-sm text-red-500">{erro}</p>}
        <button className="btn-primary w-full" type="submit">Entrar</button>
        <p className="text-center text-xs text-neutral-400">Modo local de demonstração: qualquer e-mail e senha entram.</p>
      </form>
    </div>
  )
}
