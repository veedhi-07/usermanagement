import { useState, useEffect } from "react";
import { Modal } from "../../../../components/ui/modal";
import toast from "react-hot-toast";
import { useRole } from "../../hooks/userole-hook";
import Button from "../../../../components/ui/button";
import Checkbox from "../../../../components/form/input/checkbox/index";
import Select from "../../../../components/form/select";
import FormField from "../../../../components/form/input/input-field";

const permissionKeys = ["list", "view", "add", "edit", "delete"] as const;
type PermissionKey = (typeof permissionKeys)[number];

interface Permission {
  moduleId: number;
  list: boolean;
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

export default function RoleModal({ isOpen, onClose, role }: any) {
  const { createRole, updateRole } = useRole();

  const modules = [
    { id: 1, name: "Role" },
    { id: 2, name: "Users" },
  ];

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  console.log("ROLE DATA:", role);

  const getDefaultPermissions = () =>
    modules.map((m) => ({
      moduleId: m.id,
      list: false,
      view: false,
      add: false,
      edit: false,
      delete: false,
    }));

  const [permissions, setPermissions] = useState<Permission[]>(
    getDefaultPermissions(),
  );

  useEffect(() => {
    // console.log("MODAL ROLE:", role);

    if (!role) {
      setTitle("");
      setStatus("active");
      setPermissions(getDefaultPermissions());
      return;
    }

    setTitle(role.role?.title || "");
    setStatus(role.role?.status === "active" ? "active" : "inactive");

    const mappedPermissions = modules.map((module) => {
      const existing = role.permissions?.find(
        (p: any) => Number(p.moduleId) === Number(module.id),
      );

      return {
        moduleId: module.id,
        list: !!existing?.list,
        view: !!existing?.view,
        add: !!existing?.add,
        edit: !!existing?.edit,
        delete: !!existing?.delete,
      };
    });

    setPermissions(mappedPermissions);
  }, [role, isOpen]);

  // Checkbox logic
  const handleCheckboxChange = (
    moduleId: number,
    key: PermissionKey,
    value: boolean,
  ) => {
    setPermissions((prev) =>
      prev.map((perm) => {
        if (perm.moduleId !== moduleId) return perm;

        let updated = { ...perm, [key]: value };

        if ((key === "list" && !value) || (key === "view" && !value)) {
          return {
            moduleId,
            list: false,
            view: false,
            add: false,
            edit: false,
            delete: false,
          };
        }
        if (["add", "edit", "delete"].includes(key) && value) {
          updated.list = true;
          updated.view = true;
        }

        return updated;
      }),
    );
  };

  // Submit handler
  const handleSubmit = async () => {
    const payload = {
      title,
      status,
      permissions,
    };

    try {
      if (role) {
        // EDIT
        await updateRole.mutateAsync({
          id: Number(role?.role?.id),
          data: payload,
        });
        toast.success("Role updated successfully");
      } else {
        // ADD
        await createRole.mutateAsync(payload);
        toast.success("Role created successfully");
      }
      setTimeout(() => {
        onClose();
      }, 300);
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      // className="max-w-4xl p-6"
      className="w-full max-w-5xl p-8 max-h-[70vh] overflow-y-auto"
      closeBtnClassName="absolute right-4 top-7 z-50"
    >
      <h2 className="text-xl font-semibold mb-4 dark:text-white/90">
        {role ? "Edit Role" : "Add Role"}
      </h2>

      <FormField
        type="text"
        placeholder="Role Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4 rounded dark:text-white/90"
      />

      <Select
        value={status}
        onChange={(value) => setStatus(value as "active" | "inactive")}
        options={[
          { label: "Active", value: "active" },
          { label: "Inactive", value: "inactive" },
        ]}
        className="w-full border p-2 mb-6 rounded"
      />
      <div className="overflow-x-auto">
        <table className="w-full border">
          <thead>
            <tr className="bg-gray-100">
              <th className="p-2 text-left">Module</th>
              {permissionKeys.map((key) => (
                <th key={key} className="p-2 text-center capitalize">
                  {key}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {modules.map((module) => {
              const perm = permissions.find((p) => p.moduleId === module.id);

              return (
                <tr key={module.id} className="border-t">
                  <td className="p-2 dark:text-white/90">{module.name}</td>

                  {permissionKeys.map((key) => (
                    <td key={key} className="text-center">
                      <div className="flex justify-center">
                        <Checkbox
                          checked={perm?.[key] || false}
                          onChange={(checked) =>
                            handleCheckboxChange(module.id, key, checked)
                          }
                          disabled={
                            (key === "add" ||
                              key === "edit" ||
                              key === "delete") &&
                            (!perm?.list || !perm?.view)
                          }
                        />
                      </div>
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 mt-14">
        <Button onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </Button>

        <Button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </Button>
      </div>
    </Modal>
  );
}
