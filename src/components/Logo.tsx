export default function Logo({ className = 'text-xl' }: { className?: string }) {
  return (
    <span className={`font-bold tracking-tight ${className}`}>
      Cubo<span className="text-cubo">.</span>
    </span>
  )
}
