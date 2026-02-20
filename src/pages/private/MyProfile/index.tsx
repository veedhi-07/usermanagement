
import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setProfile } from "../../../redux/reducer/profileSlice";
import userService from "../../../services/userService";
import { getAuth } from "firebase/auth";
import { Card, Avatar, Button } from "flowbite-react";
import type { ProfileData } from "../../../services/userService";
import Sidebar from "../../../components/sidebar/index";
import Navbar from "../../../components/navbar/index";
import FormField from "../../../components/form-field/FormField";

import { Formik, Form } from "formik";
import * as Yup from "yup";

export default function MyProfile() {
  const dispatch = useAppDispatch();
  const profile = useAppSelector((state) => state.profile);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [editable, setEditable] = useState(false);
  const [loading, setLoading] = useState(true);

  const [initialValues, setInitialValues] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "",
  });

  //  Validation Schema 
  const validationSchema = Yup.object({
    firstName: Yup.string().required("First name is required"),
    lastName: Yup.string().required("Last name is required"),
    email: Yup.string()
      .email("Invalid email")
      .required("Email is required"),
    phone: Yup.string()
      .matches(/^\d{10}$/, "Phone number must be exactly 10 digits"),
    role: Yup.string().required("Role is required"),
  });

  useEffect(() => {
    const loadProfile = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user) return;

      const data = await userService.fetchUserProfile(
        user.uid,
        user.email || ""
      );

      dispatch(setProfile({ uid: user.uid, ...data }));

      setInitialValues({
        role: data.role || "",
        firstName: data.firstName || "",
        lastName: data.lastName || "",
        email: data.email || "",
        phone: data.phone || "",
      });

      setLoading(false);
    };

    loadProfile();
  }, [dispatch]);

  if (loading) return <p className="p-8">Loading profile...</p>;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex-1 flex flex-col">
        <Navbar onMenuClick={() => setSidebarOpen(!sidebarOpen)} />

        <main className="p-8 bg-gradient-to-br from-blue-100 to-blue-200 flex-1">

          {/* PROFILE HEADER */}
          <Card className="mb-6 bg-white! shadow-lg rounded-xl border-none">
            <div className="flex items-center gap-5">
              <Avatar
                img="/src/assets/pp1.jpg"
                alt="Avatar"
                rounded
                size="lg"
              />

              <div>
                <h2 className="text-xl font-bold">
                  {profile.firstName} {profile.lastName}
                </h2>
                <p className="text-gray-600">
                  Email: {profile.email}
                </p>
              </div>
            </div>
          </Card>

          {/* PERSONAL INFO */}
          <Card className="shadow-lg bg-white! rounded-xl border-none">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-800 pb-2 font-serif">
                Personal Information
              </h3>

              {!editable && (
                <Button
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                  onClick={() => setEditable(true)}
                >
                  Edit
                </Button>
              )}
            </div>

            <Formik
              enableReinitialize
              initialValues={initialValues}
              validationSchema={validationSchema}
              onSubmit={async (values) => {
                try {
                  const auth = getAuth();
                  const user = auth.currentUser;
                  if (!user) return;

                  const updated =
                    await userService.updateUserProfile({
                      uid: user.uid,
                      data: values,
                    });

                  dispatch(setProfile({ uid: user.uid, ...updated }));
                  setEditable(false);
                  alert("Profile updated successfully!");
                } catch (err) {
                  console.error(err);
                  alert("Failed to update profile.");
                }
              }}
            >
              {({
                values,
                handleChange,
                handleBlur,
                errors,
                touched,
              }) => (
                <Form>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* First Name */}
                    <div>
                      {editable ? (
                        <FormField
                          id="firstName"
                          label="First Name"
                          placeholder="Enter first name"
                          value={values.firstName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.firstName}
                          touched={touched.firstName}
                        />
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">First Name</p>
                          <p>{profile.firstName}</p>
                        </>
                      )}
                    </div>

                    {/* Last Name */}
                    <div>
                      {editable ? (
                        <FormField
                          id="lastName"
                          label="Last Name"
                          placeholder="Enter last name"
                          value={values.lastName}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.lastName}
                          touched={touched.lastName}
                        />
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">Last Name</p>
                          <p>{profile.lastName}</p>
                        </>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      {editable ? (
                        <FormField
                          id="email"
                          label="Email"
                          type="email"
                          placeholder="Enter email"
                          value={values.email}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.email}
                          touched={touched.email}
                        />
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">Email</p>
                          <p>{profile.email}</p>
                        </>
                      )}
                    </div>

                    {/* Phone */}
                    <div>
                      {editable ? (
                        <FormField
                          id="phone"
                          label="Phone"
                          placeholder="Enter phone number"
                          value={values.phone}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.phone}
                          touched={touched.phone}
                        />
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">Phone</p>
                          <p>{profile.phone}</p>
                        </>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      {editable ? (
                        <FormField
                          id="role"
                          label="Role"
                          placeholder="Enter role"
                          value={values.role}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          error={errors.role}
                          touched={touched.role}
                        />
                      ) : (
                        <>
                          <p className="text-sm text-gray-500">Role</p>
                          <p>{profile.role}</p>
                        </>
                      )}
                    </div>
                  </div>

                  {editable && (
                    <div className="mt-6">
                      <Button
                        type="submit"
                        className="bg-blue-500 hover:bg-blue-600 text-white"
                      >
                        Save
                      </Button>
                    </div>
                  )}
                </Form>
              )}
            </Formik>
          </Card>
        </main>
      </div>
    </div>
  );
}