import { Users, IdCard } from "lucide-react";

export default function ParishInfo() {
  const parishInfo = [
    { label: "Family ID", value: "FAM-1274", icon: <IdCard size={20} /> },
    { label: "Community / Zone", value: "St. Joseph Community", icon: <Users size={20} /> },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Parish Information</h1>

      <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-200">
        {parishInfo.map((item, i) => (
          <div key={i} className="flex items-center gap-3 p-4">
            <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
              {item.icon}
            </div>
            <div>
              <p className="font-medium">{item.label}</p>
              <p className="text-gray-500 text-sm">{item.value}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}