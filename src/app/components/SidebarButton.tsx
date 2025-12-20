const SidebarButton = ({
  label,
  active,
  onClick,
}: {
  label: string
  active: boolean
  onClick: () => void
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-2 rounded-lg text-sm font-medium transition
      ${active ? "bg-black text-white" : "text-gray-700 hover:bg-gray-100"}`}
    >
      {label}
    </button>
  )
}

export default SidebarButton
