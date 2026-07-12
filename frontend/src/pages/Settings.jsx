import { useState } from "react";
import { Save, Moon, Bell, Shield } from "lucide-react";

export default function Settings() {
  const [settings, setSettings] = useState({
    appName: "Codity AI",
    emailNotif: true,
    jobAlerts: true,
    workerAlerts: true,
    theme: "dark",
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setSettings({
      ...settings,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  return (
    <div className="p-6 text-white bg-[#0b0f19] min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Settings</h1>

      <div className="space-y-6">

        {/* GENERAL */}
        <Section title="General" icon={<Moon />}>
          <input
            name="appName"
            value={settings.appName}
            onChange={handleChange}
            className="w-full p-3 bg-[#151b28] rounded border border-gray-700"
          />
        </Section>

        {/* NOTIFICATIONS */}
        <Section title="Notifications" icon={<Bell />}>
          <Toggle
            label="Email Notifications"
            name="emailNotif"
            checked={settings.emailNotif}
            onChange={handleChange}
          />
          <Toggle
            label="Job Alerts"
            name="jobAlerts"
            checked={settings.jobAlerts}
            onChange={handleChange}
          />
          <Toggle
            label="Worker Alerts"
            name="workerAlerts"
            checked={settings.workerAlerts}
            onChange={handleChange}
          />
        </Section>

        {/* THEME */}
        <Section title="Appearance" icon={<Moon />}>
          <select
            name="theme"
            value={settings.theme}
            onChange={handleChange}
            className="w-full p-3 bg-[#151b28] rounded border border-gray-700"
          >
            <option value="dark">Dark</option>
            <option value="light">Light</option>
          </select>
        </Section>

      </div>

      <button className="mt-6 bg-blue-600 px-6 py-3 rounded flex items-center gap-2">
        <Save size={18} />
        Save Settings
      </button>

    </div>
  );
}

function Section({ title, icon, children }) {
  return (
    <div className="bg-[#151b28] p-5 rounded-xl border border-gray-800">
      <h2 className="flex items-center gap-2 font-semibold mb-4 text-lg">
        {icon} {title}
      </h2>
      {children}
    </div>
  );
}

function Toggle({ label, name, checked, onChange }) {
  return (
    <label className="flex justify-between items-center mb-3">
      <span>{label}</span>
      <input
        type="checkbox"
        name={name}
        checked={checked}
        onChange={onChange}
      />
    </label>
  );
}