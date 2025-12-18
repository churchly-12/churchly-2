import { Users, Crown, Shield } from "lucide-react";

export default function CommunityPage() {
  const priests = [
    {
      name: "Rev. Fr. John Mathew",
      role: "Parish Priest",
      img: "/images/priest1.jpg"
    },
    {
      name: "Rev. Fr. Anthony Samuel",
      role: "Assistant Parish Priest",
      img: "/images/priest2.jpg"
    },
    {
      name: "Rev. Fr. Joseph Philip",
      role: "Assistant Parish Priest",
      img: "/images/priest3.jpg"
    }
  ];

  const parishCouncil = [
    { name: "Maria Dsouza", role: "President" },
    { name: "George Fernandes", role: "Vice President" },
    { name: "Paul Joseph", role: "Secretary" },
    { name: "Rachel Thomas", role: "Treasurer" }
  ];

  const womenCommittee = [
    { name: "Lydia Pinto", role: "Coordinator" },
    { name: "Sara John", role: "Program Lead" },
    { name: "Anita Paul", role: "Prayer Group Lead" }
  ];

  return (
    <div className="min-h-screen px-6 py-8 bg-[#f7efe6] text-[#3b2a20]">
      <h1 className="text-3xl font-extrabold mb-6">Our Community</h1>

      {/* Parish Clergy */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Crown className="text-[#6b4a2d]" size={22} />
          <h2 className="text-xl font-bold text-[#4b3426]">Parish Clergy</h2>
        </div>

        <div className="grid gap-5">
          {priests.map((priest) => (
            <div
              key={priest.name}
              className="flex gap-4 bg-white p-4 rounded-2xl shadow-sm border border-[#e8dccf]"
            >
              <img
                src={priest.img}
                alt={priest.name}
                className="w-20 h-20 rounded-xl object-cover border border-[#d6c4af]"
              />
              <div className="flex flex-col justify-center">
                <h3 className="text-lg font-semibold">{priest.name}</h3>
                <p className="text-sm text-[#6b4a2d]/80">{priest.role}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Parish Council */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Shield className="text-[#6b4a2d]" size={22} />
          <h2 className="text-xl font-bold text-[#4b3426]">
            Parish Pastoral Council
          </h2>
        </div>

        <div className="grid gap-3 bg-white p-4 rounded-2xl border border-[#e8dccf]">
          {parishCouncil.map((member) => (
            <div key={member.name} className="flex justify-between">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-[#6b4a2d]/75">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Women Committee */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-[#6b4a2d]" size={22} />
          <h2 className="text-xl font-bold text-[#4b3426]">
            Women’s Parish Committee
          </h2>
        </div>

        <div className="grid gap-3 bg-white p-4 rounded-2xl border border-[#e8dccf]">
          {womenCommittee.map((member) => (
            <div key={member.name} className="flex justify-between">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-[#6b4a2d]/75">{member.role}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Youth Ministry Team */}
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Users className="text-[#6b4a2d]" size={22} />
          <h2 className="text-xl font-bold text-[#4b3426]">Youth Ministry Team</h2>
        </div>

        <div className="grid gap-3 bg-white p-4 rounded-2xl border border-[#e8dccf]">
          {[
            { name: "Kevin Rodrigues", role: "Youth Coordinator" },
            { name: "Amanda Pereira", role: "Media & Outreach Lead" },
            { name: "Jerome D'Souza", role: "Events & Logistics Lead" },
            { name: "Priya Fernandes", role: "Prayer & Formation Lead" },
            { name: "Samuel Raj", role: "Sports & Activities Lead" }
          ].map((member) => (
            <div key={member.name} className="flex justify-between">
              <span className="font-medium">{member.name}</span>
              <span className="text-sm text-[#6b4a2d]/75">{member.role}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}