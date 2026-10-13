import { Navigate, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'
import { useAuth } from './lib/auth'
import Login from './pages/Login'
import Painel from './pages/Painel'
import Cadastros from './pages/Cadastros'
import EmBreve from './pages/EmBreve'

export default function App() {
  const { usuario } = useAuth()
  if (!usuario) return <Login />
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<Painel />} />
        <Route path="pagar" element={<EmBreve titulo="Contas a pagar" fase={2} />} />
        <Route path="receber" element={<EmBreve titulo="Contas a receber" fase={2} />} />
        <Route path="fluxo" element={<EmBreve titulo="Fluxo de caixa" fase={3} />} />
        <Route path="conciliacao" element={<EmBreve titulo="Conciliação" fase={4} />} />
        <Route path="relatorios" element={<EmBreve titulo="Relatórios" fase={5} />} />
        <Route path="cadastros" element={<Cadastros />} />
        <Route path="fechamento" element={<EmBreve titulo="Fechamento" fase={5} />} />
        <Route path="configuracoes" element={<EmBreve titulo="Configurações" fase={6} />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Route>
    </Routes>
  )
}
