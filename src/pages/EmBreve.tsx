export default function EmBreve({ titulo, fase }: { titulo: string; fase: number }) {
  return (
    <div>
      <h1 className="mb-2 text-2xl font-semibold">{titulo}</h1>
      <div className="card text-sm text-neutral-500">Esta área será construída na Fase {fase}.</div>
    </div>
  )
}
