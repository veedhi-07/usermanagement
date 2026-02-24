import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../components/firebase";

type Module = "user"| "chat"| "role"| "campaign";
type Action = "view"| "add"| "edit"|"delete";

const modules: Module[] = ["user", "chat", "role", "campaign"];
const actions: Action[] = ["view", "add", "edit", "delete"];


const AddRole = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

type ModulePermissions = Record<Action, boolean>;
type Permissions = Record<Module, ModulePermissions>;

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    user: { view: false, add: false, edit: false, delete: false },
    chat: { view: false, add: false, edit: false, delete: false },
    role: { view: false, add: false, edit: false, delete: false },
    campaign: { view: false, add: false, edit: false, delete: false },
  });

  // Fetch role if edit mode
  useEffect(() => {
    if (!isEditMode) return;

    const fetchRole = async () => {
      const docRef = doc(db, "roles", id!);
      const snapshot = await getDoc(docRef);

      if (snapshot.exists()) {
        const data = snapshot.data();
        setRoleName(data.name);
        setPermissions(data.permissions);
      }
    };

    fetchRole();
  }, [id]);

const handleToggle = (module: Module, action: Action) => {
  setPermissions((prev) => ({
    ...prev,
    [module]: {
      ...prev[module],
      [action]: !prev[module][action],
    },
  }));
};

  const handleSave = async () => {
    if (!roleName.trim()) return;

    try {
      if (isEditMode) {
        await updateDoc(doc(db, "roles", id!), {
          name: roleName,
          permissions,
          updatedAt: Timestamp.now(),
        });
      } else {
        await setDoc(doc(db, "roles", roleName), {
          name: roleName,
          permissions,
          createdAt: Timestamp.now(),
        });
      }

      navigate("/roles");
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  return (
    <div className="p-8 bg-linear-to-br from-blue-100 to-blue-200 min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-2xl font-bold mb-6">
          {isEditMode ? "Edit Role" : "Add Role"}
        </h2>

        {/* Role Name */}
        <input
          type="text"
          placeholder="Enter Role Name"
          value={roleName}
          onChange={(e) => setRoleName(e.target.value)}
          disabled={isEditMode}
          className="border p-3 mb-6 w-full rounded-lg"
        />

        {/* Permissions Table */}
        <table className="w-full border-collapse text-center">
          <thead className="bg-gray-300">
            <tr>
              <th className="border p-3">Module</th>
              {actions.map((action) => (
                <th key={action} className="border p-3 capitalize">
                  {action}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {modules.map((module) => (
              <tr key={module}>
                <td className="border p-3 capitalize font-medium">
                  {module}
                </td>

                {actions.map((action) => (
                  <td key={action} className="border p-3">
                    <input
                      type="checkbox"
                      className="w-6 h-6 accent-blue-600 cursor-pointer"
                      checked={permissions[module][action]}
                      onChange={() => handleToggle(module, action)}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>

        {/* Buttons */}
        <div className="flex justify-end gap-4 mt-6">
          <button
            onClick={() => navigate("/roles")}
            className="bg-gray-500 text-white px-4 py-2 rounded-lg"
          >
            Cancel
          </button>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddRole;