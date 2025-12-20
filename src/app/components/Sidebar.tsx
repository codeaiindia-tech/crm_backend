import { TabType } from "../admin/page"
import SidebarButton from "./SidebarButton"


const Sidebar = ({
  activeTab,
  setActiveTab,
}: {
  activeTab: TabType
  setActiveTab: (tab: TabType) => void
}) => {
  return (
    <aside className="w-60 bg-white border-r p-4 min-h-[calc(100vh-4rem)]">
      <nav className="space-y-2">
        <SidebarButton label="Overall" active={activeTab === "overall"} onClick={() => setActiveTab("overall")} />
        <SidebarButton label="Calls" active={activeTab === "call"} onClick={() => setActiveTab("call")} />
        <SidebarButton label="Employees" active={activeTab === "employee"} onClick={() => setActiveTab("employee")} />
        <SidebarButton label="Settings" active={activeTab === "settings"} onClick={() => setActiveTab("settings")} />
        <SidebarButton label="Profile" active={activeTab === "profile"} onClick={() => setActiveTab("profile")} />
      </nav>
    </aside>
  )
}

export default Sidebar
