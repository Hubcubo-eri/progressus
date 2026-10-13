// Camada de dados local (localStorage). Troca por Supabase quando o banco for definido.
// Mantem a mesma forma das tabelas fin_ para facilitar a migracao.
export type Row = { id: string; created_at: string; updated_at: string }
export type TableName = 'fin_empresas' | 'fin_pessoas' | 'fin_categorias' | 'fin_centros_custo' | 'fin_contas'

const key = (t: TableName) => `cubo.${t}`
const uid = () => crypto.randomUUID()

function read<T>(t: TableName): T[] {
  try {
    return JSON.parse(localStorage.getItem(key(t)) ?? '[]') as T[]
  } catch {
    return []
  }
}
function write<T>(t: TableName, rows: T[]) {
  localStorage.setItem(key(t), JSON.stringify(rows))
}

export function list<T extends Row & { empresa_id?: string }>(t: TableName, empresaId?: string): T[] {
  const rows = read<T>(t)
  return empresaId ? rows.filter((r) => r.empresa_id === empresaId) : rows
}

export function insert<T extends Row>(t: TableName, data: Omit<T, keyof Row>): T {
  const now = new Date().toISOString()
  const row = { ...data, id: uid(), created_at: now, updated_at: now } as T
  write(t, [...read<T>(t), row])
  return row
}

export function update<T extends Row>(t: TableName, id: string, data: Partial<T>): void {
  write(
    t,
    read<T>(t).map((r) => (r.id === id ? { ...r, ...data, updated_at: new Date().toISOString() } : r)),
  )
}

export function remove(t: TableName, id: string): void {
  write(
    t,
    read<Row>(t).filter((r) => r.id !== id),
  )
}
