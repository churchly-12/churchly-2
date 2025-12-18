import { User, Mail, Phone, Calendar, MapPin, ChevronRight } from "lucide-react";
import { Link } from "react-router-dom";

export default function PersonalInfo() {
  const personalInfo = [
    { label: "Full Name", value: "John Christopher", icon: <User size={20} /> },
    { label: "Email", value: "john@example.com", icon: <Mail size={20} /> },
    { label: "Mobile Number", value: "+91 98765 43210", icon: <Phone size={20} /> },
    { label: "Date of Birth", value: "15 Aug 1999", icon: <Calendar size={20} /> },
    { label: "Address", value: "Chennai, India", icon: <MapPin size={20} /> },
  ];

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Personal Information</h1>

      <div className="bg-white rounded-2xl shadow-md divide-y divide-gray-100">
        {personalInfo.map((item, i) => (
          <Link
            key={i}
            to={`/account/edit/${item.label.toLowerCase().replace(/ /g, '-')}`}
            className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition"
          >
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-[#f7efe6] text-[#6b4a2d]">
                {item.icon}
              </div>
              <div>
                <p className="text-gray-900 font-medium">{item.label}</p>
                <p className="text-gray-500 text-sm">{item.value}</p>
              </div>
            </div>
            <ChevronRight className="text-gray-400" size={20} />
          </Link>
        ))}
      </div>
    </div>
  );
}