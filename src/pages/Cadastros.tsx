import { useState } from 'react'
import Crud from '../components/Crud'
import { brl, dataBr } from '../lib/format'
import { useAuth, criarEmpresa } from '../lib/auth'
import { PLANO_MODELO } from '../lib/planoModelo'
import { insert } from '../lib/store'
import type { Categoria, CentroCusto, Conta, Empresa, Pessoa } from '../lib/types'
import { useQueryClient } from '@tanstack/react-query'

const sim = (b: boolean) => (b ? 'Sim' : 'Não')
const TABS = ['Empresas', 'Pessoas', 'Categorias', 'Centros de custo', 'Contas'] as const

export default function Cadastros() {
  const [tab, setTab] = useState<(typeof TABS)[number]>('Pessoas')
  const { usuario, empresaId } = useAuth()
  const qc = useQueryClient()
  const admin = usuario?.perfil === 'admin'
  const podeEditar = usuario?.perfil !== 'cliente'

  return (
    <div>
      <h1 className="mb-4 text-2xl font-semibold">Cadastros</h1>
      <div className="mb-6 flex gap-1 overflow-x-auto border-b border-neutral-100">
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`whitespace-nowrap px-3 py-2 text-sm ${tab === t ? 'border-b-2 border-cubo font-medium text-cubo-dark' : 'text-neutral-500'}`}
          >
            {t}
          </button>
        ))}
      </div>

      {tab === 'Empresas' && (
        <>
          {admin && (
            <NovaEmpresa
              onCriada={() => qc.invalidateQueries({ queryKey: ['fin_empresas'] })}
            />
          )}
          <Crud<Empresa>
            table="fin_empresas"
            title="Empresas"
            scoped={false}
            canEdit={admin}
            empty={{ regime: 'simples', ativo: true }}
            fields={[
              { name: 'razao_social', label: 'Razão social', required: true },
              { name: 'nome_fantasia', label: 'Nome fantasia' },
              { name: 'cnpj', label: 'CNPJ' },
              {
                name: 'regime', label: 'Regime', type: 'select',
                options: [
                  { value: 'simples', label: 'Simples Nacional' },
                  { value: 'presumido', label: 'Lucro presumido' },
                  { value: 'real', label: 'Lucro real' },
                  { value: 'mei', label: 'MEI' },
                ],
              },
              { name: 'ativo', label: 'Ativa', type: 'checkbox' },
            ]}
            columns={[
              { label: 'Razão social', render: (r) => r.razao_social },
              { label: 'Fantasia', render: (r) => r.nome_fantasia },
              { label: 'CNPJ', render: (r) => r.cnpj },
              { label: 'Regime', render: (r) => r.regime },
              { label: 'Ativa', render: (r) => sim(r.ativo) },
            ]}
          />
        </>
      )}

      {tab === 'Pessoas' && (
        <Crud<Pessoa>
          key={empresaId}
          table="fin_pessoas"
          title="Pessoas"
          canEdit={podeEditar}
          empty={{ tipo: 'cliente' }}
          fields={[
            { name: 'nome', label: 'Nome', required: true },
            { name: 'documento', label: 'CPF ou CNPJ' },
            {
              name: 'tipo', label: 'Tipo', type: 'select',
              options: [
                { value: 'cliente', label: 'Cliente' },
                { value: 'fornecedor', label: 'Fornecedor' },
                { value: 'ambos', label: 'Ambos' },
              ],
            },
            { name: 'email', label: 'E-mail' },
            { name: 'telefone', label: 'Telefone' },
            { name: 'observacoes', label: 'Observações' },
          ]}
          columns={[
            { label: 'Nome', render: (r) => r.nome },
            { label: 'Documento', render: (r) => r.documento },
            { label: 'Tipo', render: (r) => r.tipo },
            { label: 'E-mail', render: (r) => r.email },
          ]}
        />
      )}

      {tab === 'Categorias' && (
        <>
          {podeEditar && (
            <button
              className="btn-ghost mb-4"
              onClick={() => {
                PLANO_MODELO.forEach((p) => insert<Categoria>('fin_categorias', { ...p, empresa_id: empresaId, pai_id: '' }))
                qc.invalidateQueries({ queryKey: ['fin_categorias'] })
              }}
            >
              Copiar plano de contas modelo
            </button>
          )}
          <Crud<Categoria>
            key={empresaId}
            table="fin_categorias"
            title="Categorias"
            canEdit={podeEditar}
            empty={{ tipo: 'despesa', grupo_dre: 'despesas_operacionais' }}
            fields={[
              { name: 'codigo', label: 'Código' },
              { name: 'nome', label: 'Nome', required: true },
              {
                name: 'tipo', label: 'Tipo', type: 'select',
                options: [{ value: 'receita', label: 'Receita' }, { value: 'despesa', label: 'Despesa' }],
              },
              {
                name: 'grupo_dre', label: 'Grupo da DRE', type: 'select',
                options: [
                  { value: 'receita_bruta', label: 'Receita bruta' },
                  { value: 'deducoes', label: 'Deduções' },
                  { value: 'custos', label: 'Custos' },
                  { value: 'despesas_operacionais', label: 'Despesas operacionais' },
                  { value: 'despesas_financeiras', label: 'Despesas financeiras' },
                  { value: 'outras', label: 'Outras' },
                ],
              },
            ]}
            columns={[
              { label: 'Código', render: (r) => r.codigo },
              { label: 'Nome', render: (r) => r.nome },
              { label: 'Tipo', render: (r) => r.tipo },
              { label: 'Grupo da DRE', render: (r) => r.grupo_dre.replace(/_/g, ' ') },
            ]}
          />
        </>
      )}

      {tab === 'Centros de custo' && (
        <Crud<CentroCusto>
          key={empresaId}
          table="fin_centros_custo"
          title="Centros de custo"
          canEdit={podeEditar}
          empty={{ ativo: true }}
          fields={[
            { name: 'nome', label: 'Nome', required: true },
            { name: 'ativo', label: 'Ativo', type: 'checkbox' },
          ]}
          columns={[
            { label: 'Nome', render: (r) => r.nome },
            { label: 'Ativo', render: (r) => sim(r.ativo) },
          ]}
        />
      )}

      {tab === 'Contas' && (
        <Crud<Conta>
          key={empresaId}
          table="fin_contas"
          title="Contas financeiras"
          canEdit={podeEditar}
          empty={{ tipo: 'banco', saldo_inicial_centavos: 0, ativo: true }}
          fields={[
            { name: 'nome', label: 'Nome', required: true },
            {
              name: 'tipo', label: 'Tipo', type: 'select',
              options: [
                { value: 'banco', label: 'Banco' },
                { value: 'caixa', label: 'Caixa' },
                { value: 'cartao', label: 'Cartão' },
                { value: 'adquirente', label: 'Adquirente' },
              ],
            },
            { name: 'banco', label: 'Banco' },
            { name: 'saldo_inicial_centavos', label: 'Saldo inicial (R$)', type: 'money' },
            { name: 'data_saldo_inicial', label: 'Data do saldo inicial', type: 'date' },
            { name: 'ativo', label: 'Ativa', type: 'checkbox' },
          ]}
          columns={[
            { label: 'Nome', render: (r) => r.nome },
            { label: 'Tipo', render: (r) => r.tipo },
            { label: 'Saldo inicial', render: (r) => brl(r.saldo_inicial_centavos) },
            { label: 'Data', render: (r) => dataBr(r.data_saldo_inicial) },
          ]}
        />
      )}
    </div>
  )
}

function NovaEmpresa({ onCriada }: { onCriada: () => void }) {
  const [nome, setNome] = useState('')
  const [plano, setPlano] = useState(true)
  const { setEmpresaId } = useAuth()
  return (
    <form
      className="card mb-4 flex flex-wrap items-center gap-3"
      onSubmit={(e) => {
        e.preventDefault()
        if (!nome.trim()) return
        const emp = criarEmpresa(
          { razao_social: nome, nome_fantasia: nome, cnpj: '', regime: 'simples', ativo: true },
          plano,
        )
        setEmpresaId(emp.id)
        setNome('')
        onCriada()
      }}
    >
      <input className="input max-w-xs" placeholder="Nome da nova empresa" value={nome} onChange={(e) => setNome(e.target.value)} />
      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input type="checkbox" checked={plano} onChange={(e) => setPlano(e.target.checked)} />
        Copiar plano de contas modelo
      </label>
      <button className="btn-primary" type="submit">Criar empresa</button>
    </form>
  )
}
