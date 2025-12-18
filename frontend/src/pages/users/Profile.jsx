import UserProfileSummary from "../../components/UserProfileSummary.jsx";

export default function Profile() {
  return (
    <div className="min-h-screen px-6 py-8 bg-[#f7efe6] text-[#3b2a20]">
      <h1 className="text-3xl font-extrabold mb-6">Profile</h1>

      <UserProfileSummary />

      {/* Additional profile sections can be added here */}
    </div>
  );
}