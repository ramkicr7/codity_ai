import { useState } from "react";
import { User, Mail, Briefcase } from "lucide-react";

export default function Profile() {
  const [user, setUser] = useState({
    name: "Codity User",
    email: "user@codity.ai",
    role: "Admin",
  });

  return (
    <div className="p-6 text-white bg-[#0b0f19] min-h-screen">

      <h1 className="text-3xl font-bold mb-6">Profile</h1>

      {/* PROFILE CARD */}
      <div className="bg-[#151b28] p-6 rounded-xl border border-gray-800 mb-6">

        <div className="flex items-center gap-4">
          <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
            <User size={30} />
          </div>

          <div>
            <h2 className="text-xl font-bold">{user.name}</h2>
            <p className="text-gray-400">{user.role}</p>
          </div>
        </div>

      </div>

      {/* INFO */}
      <div className="grid gap-4">

        <Info icon={<User />} label="Name" value={user.name} />
        <Info icon={<Mail />} label="Email" value={user.email} />
        <Info icon={<Briefcase />} label="Role" value={user.role} />

      </div>

    </div>
  );
}

function Info({ icon, label, value }) {
  return (
    <div className="bg-[#151b28] p-4 rounded-xl border border-gray-800 flex justify-between">
      <div className="flex items-center gap-2">
        {icon}
        <span>{label}</span>
      </div>
      <span className="text-gray-300">{value}</span>
    </div>
  );
}