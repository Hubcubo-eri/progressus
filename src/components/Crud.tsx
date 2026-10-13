import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { insert, list, remove, update, type Row, type TableName } from '../lib/store'
import { useAuth } from '../lib/auth'

export interface Field<T> {
  name: keyof T & string
  label: string
  type?: 'text' | 'select' | 'checkbox' | 'money' | 'date'
  options?: { value: string; label: string }[]
  required?: boolean
}
export interface Column<T> {
  label: string
  render: (r: T) => React.ReactNode
}

interface Props<T extends Row> {
  table: TableName
  title: string
  scoped?: boolean
  fields: Field<T>[]
  columns: Column<T>[]
  empty: Partial<Omit<T, keyof Row>>
  canEdit?: boolean
}

export default function Crud<T extends Row>({ table, title, scoped = true, fields, columns, empty, canEdit = true }: Props<T>) {
  const { empresaId } = useAuth()
  const qc = useQueryClient()
  const qk = [table, scoped ? empresaId : 'all']
  const { data, isLoading, isError } = useQuery({
    queryKey: qk,
    queryFn: () => list<T & { empresa_id?: string }>(table, scoped ? empresaId : undefined),
  })
  const [editing, setEditing] = useState<{ id?: string; values: Record<string, unknown> } | null>(null)
  const [busca, setBusca] = useState('')

  const invalidate = () => qc.invalidateQueries({ queryKey: [table] })
  const save = useMutation({
    mutationFn: async () => {
      if (!editing) return
      const values = { ...editing.values, ...(scoped ? { empresa_id: empresaId } : {}) }
      if (editing.id) update<Row>(table, editing.id, values as Partial<Row>)
      else insert(table, values as Omit<T, keyof Row>)
    },
    onSuccess: () => {
      invalidate()
      setEditing(null)
    },
  })
  const del = useMutation({ mutationFn: async (id: string) => remove(table, id), onSuccess: invalidate })

  const set = (name: string, v: unknown) => setEditing((e) => (e ? { ...e, values: { ...e.values, [name]: v } } : e))
  const rows = (data ?? []).filter((r) => !busca || JSON.stringify(r).toLowerCase().includes(busca.toLowerCase()))
  const missing = editing && fields.some((f) => f.required && !String(editing.values[f.name] ?? '').trim())

  return (
    <div>
      <div className="mb-4 flex items-center justify-between gap-3">
        <input className="input max-w-xs" placeholder="Buscar" value={busca} onChange={(e) => setBusca(e.target.value)} />
        {canEdit && (
          <button className="btn-primary" onClick={() => setEditing({ values: { ...empty } })}>
            Novo
          </button>
        )}
      </div>

      {isLoading && <p className="text-sm text-neutral-500">Carregando...</p>}
      {isError && <p className="text-sm text-red-500">Não foi possível carregar os dados.</p>}
      {!isLoading && !isError && rows.length === 0 && (
        <div className="card text-center text-sm text-neutral-500">Nenhum registro em {title.toLowerCase()}.</div>
      )}
      {rows.length > 0 && (
        <div className="overflow-x-auto rounded-2xl border border-neutral-100">
          <table className="w-full text-left text-sm">
            <thead className="border-b border-neutral-100 text-xs uppercase text-neutral-400">
              <tr>
                {columns.map((c) => (
                  <th key={c.label} className="px-4 py-3 font-medium">{c.label}</th>
                ))}
                <th />
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.id} className="border-b border-neutral-50 last:border-0">
                  {columns.map((c) => (
                    <td key={c.label} className="px-4 py-3">{c.render(r)}</td>
                  ))}
                  <td className="whitespace-nowrap px-4 py-3 text-right">
                    {canEdit && (
                      <>
                        <button
                          className="mr-3 text-neutral-500 hover:text-cubo"
                          onClick={() => setEditing({ id: r.id, values: { ...r } })}
                        >
                          Editar
                        </button>
                        <button
                          className="text-neutral-400 hover:text-red-500"
                          onClick={() => confirm('Excluir este registro?') && del.mutate(r.id)}
                        >
                          Excluir
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {editing && (
        <div className="fixed inset-0 z-30 flex justify-end bg-black/20" onClick={() => setEditing(null)}>
          <form
            className="h-full w-full max-w-md space-y-4 overflow-y-auto bg-white p-6 shadow-xl"
            onClick={(e) => e.stopPropagation()}
            onSubmit={(e) => {
              e.preventDefault()
              if (!missing) save.mutate()
            }}
          >
            <h2 className="text-lg font-semibold">{editing.id ? 'Editar' : 'Novo'} registro</h2>
            {fields.map((f) => (
              <label key={f.name} className="block text-sm">
                <span className="mb-1 block text-neutral-500">{f.label}{f.required && ' *'}</span>
                {f.type === 'select' ? (
                  <select className="input" value={String(editing.values[f.name] ?? '')} onChange={(e) => set(f.name, e.target.value)}>
                    {f.options?.map((o) => (
                      <option key={o.value} value={o.value}>{o.label}</option>
                    ))}
                  </select>
                ) : f.type === 'checkbox' ? (
                  <input type="checkbox" checked={Boolean(editing.values[f.name])} onChange={(e) => set(f.name, e.target.checked)} />
                ) : f.type === 'money' ? (
                  <input
                    className="input"
                    inputMode="decimal"
                    placeholder="0,00"
                    defaultValue={((Number(editing.values[f.name]) || 0) / 100).toFixed(2).replace('.', ',')}
                    onChange={(e) => set(f.name, Math.round(parseFloat(e.target.value.replace(/\./g, '').replace(',', '.') || '0') * 100))}
                  />
                ) : (
                  <input
                    className="input"
                    type={f.type === 'date' ? 'date' : 'text'}
                    value={String(editing.values[f.name] ?? '')}
                    onChange={(e) => set(f.name, e.target.value)}
                  />
                )}
              </label>
            ))}
            <div className="flex gap-2 pt-2">
              <button type="submit" className="btn-primary" disabled={Boolean(missing)}>Salvar</button>
              <button type="button" className="btn-ghost" onClick={() => setEditing(null)}>Cancelar</button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}
