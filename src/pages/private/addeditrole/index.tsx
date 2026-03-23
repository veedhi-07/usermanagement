import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { doc, getDoc, setDoc, updateDoc, Timestamp } from "firebase/firestore";
import { db } from "../../../services/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../../../components/form-field/formfield";
import Button from "../../../components/button";
import Sidebar from "../../../components/sidebar";
import Navbar from "../../../components/navbar";
type Module = "user" | "chat" | "role" | "campaign";
type Action = "view" | "add" | "edit" | "delete";

const modules: Module[] = ["user", "chat", "role", "campaign"];
const actions: Action[] = ["view", "add", "edit", "delete"];

const AddRole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
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

  // // Fetch role if edit mode
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

  // const { data: roles } = usefirebasecollection<Role>("roles");

  const handleToggle = (module: Module, action: Action) => {
    setPermissions((prev) => {
      const current = prev[module];

      const updated: ModulePermissions = {
        ...current, //If edit=false
        [action]: !current[action], //now true than action != currentaction
      };

      const childActions: Action[] = ["add", "edit", "delete"];
      //Did user click add/edit/delete? &&:After toggling, is it now true?: If both are true:
      if (childActions.includes(action) && updated[action]) {
        updated.view = true;
      }

      //user clciked view && updated:view=false than everything becomes false.
      if (action === "view" && !updated.view) {
        childActions.forEach((a) => {
          updated[a] = false;
        });
      }

      return {
        ...prev,
        [module]: updated,
      };
    });
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
      navigate("/roles", {
        state: {
          message: isEditMode
            ? "Role updated successfully!"
            : "Role created successfully!",
        },
      });
    } catch (error) {
      console.error("Error saving role:", error);
    }
  };

  return (
    <>
      <ToastContainer />

      <div className="flex min-h-screen bg-gray-100">
        <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

        <div className="flex-1 flex flex-col">
          <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

          <div className="p-8 bg-linear-to-br from-blue-100 to-blue-200 min-h-screen">
            <div
              className="bg-white p-6 rounded-lg shadow-lg"
              style={{ marginLeft: sidebarOpen ? "16rem" : "0" }}
            >
              <h2 className="text-2xl font-bold mb-6">
                {isEditMode ? "Edit Role" : "Add Role"}
              </h2>
              <form>
                <FormField
                  id="roleName"
                  label="Role Name"
                  type="text"
                  placeholder="Enter Role Name"
                  value={roleName}
                  onChange={(e) => setRoleName(e.target.value)}
                  onBlur={() => {}}
                  disabled={isEditMode}
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
                            <FormField
                              id={`${module}-${action}`}
                              className="w-5 h-5 accent-blue-600 cursor-pointer bg-white! checked:bg-blue-600!"
                              type="checkbox"
                              checked={permissions[module][action]}
                              onChange={() => handleToggle(module, action)}
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </form>
              {/* Buttons */}
              <div className="flex justify-end gap-4 mt-6">
                <Button onClick={() => navigate("/roles")}>Cancel</Button>

                <Button onClick={handleSave}>Save</Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddRole;
