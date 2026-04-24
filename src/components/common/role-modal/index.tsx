// import { useState } from "react";
// import { useEffect } from "react";
// import { Modal } from "../../../components/ui/modal";
// import { useRole } from "../../../features/roles/hooks/userole-hook";
// const permissionKeys = ["list", "view", "add", "edit", "delete"] as const;

// type PermissionKey = (typeof permissionKeys)[number];

// interface Permission {
//   moduleId: number;
//   list: boolean;
//   view: boolean;
//   add: boolean;
//   edit: boolean;
//   delete: boolean;
// }

// export default function RoleModal({ isOpen, onClose, role }: any) {
//   const { updateRole } = useRole();
//   const modules = [
//     { id: 1, name: "Users" },
//     { id: 2, name: "Roles" },
//   ];
//   const [title, setTitle] = useState("");
//   const [status, setStatus] = useState("active");

//   const [permissions, setPermissions] = useState<Permission[]>(
//     modules.map((m) => ({
//       moduleId: m.id,
//       list: false,
//       view: false,
//       add: false,
//       edit: false,
//       delete: false,
//     })),
//   );

//   // const handleCheckboxChange = (moduleId: number, key: PermissionKey) => {
//   //   setPermissions((prev) =>
//   //     prev.map((perm) =>
//   //       perm.moduleId === moduleId ? { ...perm, [key]: !perm[key] } : perm,
//   //     ),
//   //   );
//   // };
//   const handleCheckboxChange = (
//     moduleId: number,
//     key: PermissionKey,
//     value: boolean,
//   ) => {
//     setPermissions((prev) =>
//       prev.map((perm) => {
//         if (perm.moduleId !== moduleId) return perm;

//         let updated = { ...perm, [key]: value };

//         // rule 1
//         if ((key === "list" && !value) || (key === "view" && !value)) {
//           return {
//             moduleId,
//             list: false,
//             view: false,
//             add: false,
//             edit: false,
//             delete: false,
//           };
//         }

//         // rule 2
//         if (["add", "edit", "delete"].includes(key) && value) {
//           updated.list = true;
//           updated.view = true;
//         }

//         return updated;
//       }),
//     );
//   };
//   const handleSubmit = async () => {
//     if (!role) {
//       console.log("Create logic here");
//       return;
//     }

//     const payload = {
//       title,
//       status: status === "active",
//       permissions,
//     };

//     try {
//       console.log("CALLING API...");
//       const res = await updateRole.mutateAsync({
//         id: Number(role.id),
//         data: payload,
//       });
//       console.log("API RESPONSE:", res);
//       onClose();
//     } catch (err) {
//       console.error("ERROR:", err);
//     }
//   };

//   return (
//     <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6">
//       <h2 className="text-xl font-semibold mb-4">Create Role</h2>

//       {/* Title */}
//       <input
//         type="text"
//         placeholder="Role Title"
//         value={title}
//         onChange={(e) => setTitle(e.target.value)}
//         className="w-full border p-2 mb-4 rounded"
//       />

//       {/* Status */}
//       <select
//         value={status}
//         onChange={(e) => setStatus(e.target.value)}
//         className="w-full border p-2 mb-6 rounded"
//       >
//         <option value="active">Active</option>
//         <option value="inactive">Inactive</option>
//       </select>

//       {/* Permissions Table */}
//       <div className="overflow-x-auto">
//         <table className="w-full border">
//           <thead>
//             <tr className="bg-gray-100">
//               <th className="p-2 text-left">Module</th>
//               {permissionKeys.map((key) => (
//                 <th key={key} className="p-2 capitalize">
//                   {key}
//                 </th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {modules.map((module) => {
//               const perm = permissions.find((p) => p.moduleId === module.id);

//               return (
//                 <tr key={module.id} className="border-t">
//                   <td className="p-2">{module.name}</td>

//                   {permissionKeys.map((key) => (
//                     <td key={key} className="text-center">
//                       <input
//                         type="checkbox"
//                         checked={perm?.[key] || false}
//                         onChange={(e) =>
//                           handleCheckboxChange(module.id, key, e.target.checked)
//                         }
//                       />
//                     </td>
//                   ))}
//                 </tr>
//               );
//             })}
//           </tbody>
//         </table>
//       </div>

//       {/* Actions */}
//       <div className="flex justify-end gap-3 mt-6">
//         <button onClick={onClose} className="px-4 py-2 border rounded">
//           Cancel
//         </button>

//         <button
//           onClick={handleSubmit}
//           type="submit"
//           className="px-4 py-2 bg-blue-500 text-white rounded"
//         >
//           Save
//         </button>
//       </div>
//     </Modal>
//   );
// }
import { useState, useEffect } from "react";
import { Modal } from "../../../components/ui/modal";
import { useRole } from "../../../features/roles/hooks/userole-hook";
import Checkbox from "../../../components/form/input/Checkbox";

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
    { id: 1, name: "Users" },
    { id: 2, name: "Roles" },
  ];

  const [title, setTitle] = useState("");
  const [status, setStatus] = useState<"active" | "inactive">("active");
  // console.log("ROLE DATA:", role);
  // console.log("PERMISSIONS:", role?.permissions);
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
  // useEffect(() => {
  //   if (role) {
  //     setTitle(role.title || "");
  //     setStatus(role.status === "active" ? "active" : "inactive");

  //     // map API permissions into UI structure
  //     const mappedPermissions = modules.map((module) => {
  //       const existing = role.permissions?.find(
  //         (p: any) => Number(p.moduleId) === Number(module.id),
  //       );

  //       return {
  //         moduleId: module.id,
  //         list: existing?.list || false,
  //         view: existing?.view || false,
  //         add: existing?.add || false,
  //         edit: existing?.edit || false,
  //         delete: existing?.delete || false,
  //       };
  //     });

  //     setPermissions(mappedPermissions);
  //   } else {
  //     // RESET for create mode
  //     setTitle("");
  //     setStatus("active");
  //     setPermissions(
  //       modules.map((m) => ({
  //         moduleId: m.id,
  //         list: false,
  //         view: false,
  //         add: false,
  //         edit: false,
  //         delete: false,
  //       })),
  //     );
  //   }
  // }, [role]);
  useEffect(() => {
    if (!role) {
      setTitle("");
      setStatus("active");
      setPermissions(getDefaultPermissions());
      return;
    }

    // console.log("ROLE DATA:", role);

    setTitle(role.title || "");
    setStatus(role.status === "active" ? "active" : "inactive");

    const mappedPermissions = modules.map((module) => {
      const existing = role.permissions?.find(
        (p: any) => Number(p.moduleId) === Number(module.id),
      );

      return {
        moduleId: module.id,
        list: existing?.list ?? false,
        view: existing?.view ?? false,
        add: existing?.add ?? false,
        edit: existing?.edit ?? false,
        delete: existing?.delete ?? false,
      };
    });

    // console.log("MAPPED:", mappedPermissions);

    setPermissions(mappedPermissions);
  }, [role, isOpen]);
  // //  Prefill for edit / reset for add
  // useEffect(() => {
  //   if (role) {
  //     setTitle(role.title);
  //     setStatus(role.status);

  //     const mapped = modules.map((module) => {
  //       const existing = role.permissions?.find(
  //         (p: any) => p.moduleId === module.id,
  //       );

  //       return {
  //         moduleId: module.id,
  //         list: existing?.list || false,
  //         view: existing?.view || false,
  //         add: existing?.add || false,
  //         edit: existing?.edit || false,
  //         delete: existing?.delete || false,
  //       };
  //     });

  //     setPermissions(mapped);
  //   } else {
  //     setTitle("");
  //     setStatus("active");
  //     setPermissions(getDefaultPermissions());
  //   }
  // }, [role, isOpen]);

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

        // If list/view unchecked → clear all
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

        //  If add/edit/delete checked → ensure list + view
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
          id: Number(role.id),
          data: payload,
        });
      } else {
        // ADD
        await createRole.mutateAsync(payload);
      }

      onClose();
    } catch (err) {
      console.error("ERROR:", err);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} className="max-w-3xl p-6">

      <h2 className="text-xl font-semibold mb-4">
        {role ? "Edit Role" : "Add Role"}
      </h2>


      <input
        type="text"
        placeholder="Role Title"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full border p-2 mb-4 rounded"
      />


      <select
        value={status}
        onChange={(e) => setStatus(e.target.value as "active" | "inactive")}
        className="w-full border p-2 mb-6 rounded"
      >
        <option value="active">Active</option>
        <option value="inactive">Inactive</option>
      </select>

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
                  <td className="p-2">{module.name}</td>

                  {permissionKeys.map((key) => (
                    <td key={key} className="text-center">
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
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="flex justify-end gap-3 mt-6">
        <button onClick={onClose} className="px-4 py-2 border rounded">
          Cancel
        </button>

        <button
          onClick={handleSubmit}
          className="px-4 py-2 bg-blue-500 text-white rounded"
        >
          Save
        </button>
      </div>
    </Modal>
  );
}
