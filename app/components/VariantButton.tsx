type VariantButtonProps = {
  active: boolean
  onClick: () => void
  children: React.ReactNode
}

export function VariantButton({
  active,
  onClick,
  children
}: VariantButtonProps) {
  return (
    <button
      onClick={onClick}
      className={`
        flex-1 px-4 py-2 rounded-md text-sm transition-all
        ${active
          ? "bg-emerald-500/20 text-emerald-300 shadow-inner"
          : "opacity-60 hover:opacity-100 pulseGlow"
        }
      `}
    >
      {children}
    </button>
  )
}
