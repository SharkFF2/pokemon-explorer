export function FormButton({
  active,
  disabled,
  onClick,
  icon,
  children
}: {
  active?: boolean
  disabled?: boolean
  onClick?: () => void
  icon?: string
  children: React.ReactNode
}) {
  return (
    <button
      onClick={disabled ? undefined :onClick}
      disabled = {disabled}
      className={`
        px-3 py-2 rounded-lg text-sm transition-all glass
        ${active
          ? "bg-indigo-500/20 text-indigo-300"
          : "opacity-60 hover:opacity-100"
        }
        ${disabled ? "opacity-30 cursor-not-allowed" : "opacity-100 cursor-pointer"}
      `}
    >
      {children}
    </button>
  )
}
