const SettingsTab = () => {
  return (
    <div>
      <h2 className="text-lg font-semibold mb-4">Settings</h2>

      <div className="bg-white border rounded-xl p-4 space-y-3">
        <div>
          <p className="text-sm font-medium">Profile Settings</p>
          <p className="text-xs text-gray-500">Manage admin profile</p>
        </div>
        <div>
          <p className="text-sm font-medium">Security</p>
          <p className="text-xs text-gray-500">Change password & sessions</p>
        </div>
      </div>
    </div>
  )
}

export default SettingsTab
