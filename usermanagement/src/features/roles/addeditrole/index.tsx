import { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import FormField from "../../../components/common/form-field/formfield";
import Button from "../../../components/common/button";
import Sidebar from "../../../components/layout/sidebar";
import Navbar from "../../../components/layout/navbar";
import { useRole, useCreateRole, useUpdateRole } from "../../../hooks/use-role";
import type { Roles } from "../../../types";
import type { Permissions, Module, Action } from "../../../types";
const modules: Module[] = ["user", "chat", "role", "campaign"];
const actions: Action[] = ["view", "add", "edit", "delete"];

const AddRole = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);

  type ModulePermissions = Record<Action, boolean>;

  const [roleName, setRoleName] = useState("");
  const [permissions, setPermissions] = useState<Permissions>({
    user: { view: false, add: false, edit: false, delete: false },
    chat: { view: false, add: false, edit: false, delete: false },
    role: { view: false, add: false, edit: false, delete: false },
    campaign: { view: false, add: false, edit: false, delete: false },
  });

  const { data: roles = [] } = useRole();

  const updateRole = useUpdateRole();
  const createRole = useCreateRole();
  const mapPermissions = (
    apiPermissions?: Roles["permissions"],
  ): Permissions => {
    return {
      user: {
        view: !!apiPermissions?.users?.view,
        add: !!apiPermissions?.users?.add,
        edit: !!apiPermissions?.users?.edit,
        delete: !!apiPermissions?.users?.delete,
      },
      role: {
        view: !!apiPermissions?.roles?.view,
        add: !!apiPermissions?.roles?.add,
        edit: !!apiPermissions?.roles?.edit,
        delete: !!apiPermissions?.roles?.delete,
      },
      chat: {
        view: !!apiPermissions?.chat?.view,
        add: !!apiPermissions?.chat?.add,
        edit: !!apiPermissions?.chat?.edit,
        delete: !!apiPermissions?.chat?.delete,
      },
      campaign: {
        view: !!apiPermissions?.campaign?.view,
        add: !!apiPermissions?.campaign?.add,
        edit: !!apiPermissions?.campaign?.edit,
        delete: !!apiPermissions?.campaign?.delete,
      },
    };
  };
  useEffect(() => {
    if (!isEditMode || !id) return;

    const role = roles.find((r) => r.id === id) as Roles | undefined;

    if (!role) return;

    setRoleName(role.role);
    setPermissions(mapPermissions(role.permissions));
  }, [id, isEditMode, roles]);

  const handleToggle = (module: Module, action: Action) => {
    setPermissions((prev) => {
      const current = prev[module];

      const updated: ModulePermissions = {
        ...current,
        [action]: !current[action],
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

  const handleSave = useCallback(() => {
    if (!roleName.trim()) return;

    const payload = {
      name: roleName,
      permissions,
      ...(isEditMode
        ? { updatedAt: new Date().toISOString() }
        : { createdAt: new Date().toISOString() }),
    };

    if (isEditMode && id) {
      updateRole.mutate(
        { id, data: payload },
        {
          onSuccess: () => {
            navigate("/roles", {
              state: { message: "Role updated successfully!" },
            });
          },
        },
      );
    } else {
      createRole.mutate(payload, {
        onSuccess: () => {
          navigate("/roles", {
            state: { message: "Role created successfully!" },
          });
        },
      });
    }
  }, [roleName, isEditMode, id, permissions, navigate]);
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
