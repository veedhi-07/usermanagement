import { Formik, Form } from "formik";
import * as Yup from "yup";
import FormField from "../../components/form-field/FormField";

type User = {
id: string;
email: string;
firstName: string;
lastName: string;
role: string;
};

type Props = {
user: User;
onClose: () => void;
onSave: (values: Omit<User, "id">) => void;
};

const validationSchema = Yup.object({
firstName: Yup.string().required("First name is required"),
lastName: Yup.string().required("Last name is required"),
email: Yup.string().email("Invalid email").required("Email is required"),
role: Yup.string().required("Role is required"),
});

export default function EditUserModal({ user, onClose, onSave }: Props) {
return ( 
<div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
 <div className="bg-white p-6 rounded-lg shadow-lg w-105">
   <h2 className="text-xl font-bold mb-4">Edit User</h2>

    <Formik
      initialValues={{
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      }}
      validationSchema={validationSchema}
      onSubmit={(values) => {
        onSave(values);
      }}
    >
      {({ values, handleChange, handleBlur, errors, touched }) => (
        <Form className="space-y-3">

          <FormField
            id="firstName"
            label="First Name"
            placeholder="First name"
            value={values.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.firstName}
            touched={touched.firstName}
          />

          <FormField
            id="lastName"
            label="Last Name"
            placeholder="Last name"
            value={values.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.lastName}
            touched={touched.lastName}
          />

          <FormField
            id="email"
            label="Email"
            type="email"
            placeholder="Email"
            value={values.email}
            onChange={handleChange}
            onBlur={handleBlur}
            error={errors.email}
            touched={touched.email}
          />

          <div>
            <label className="text-sm text-gray-600">Role</label>
            <select
              name="role"
              value={values.role}
              onChange={handleChange}
              onBlur={handleBlur}
              className="w-full border p-2 rounded"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>

            {touched.role && errors.role && (
              <p className="text-red-500 text-sm">{errors.role}</p>
            )}
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border rounded"
            >
              Cancel
            </button>

            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded border"
            >
              Save
            </button>
          </div>

        </Form>
      )}
    </Formik>
  </div>
</div>


);
}
