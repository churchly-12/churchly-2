import { useParams } from "react-router-dom";

export default function EditField() {
  const { field } = useParams();

  return (
    <div className="p-4 space-y-6">
      <h1 className="text-2xl font-bold">Edit {field.replace('-', ' ')}</h1>

      <input
        type="text"
        placeholder={`Enter new ${field.replace('-', ' ')}`}
        className="w-full p-3 border rounded-xl"
      />

      <button className="w-full bg-[#6b4a2d] text-white py-3 rounded-xl">
        Save
      </button>
    </div>
  );
}