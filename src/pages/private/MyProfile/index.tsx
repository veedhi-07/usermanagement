import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../../redux/hooks";
import { setProfile } from "../../../redux/reducer/profileSlice";
import userService from "../../../services/userService";
import { getAuth } from "firebase/auth";
import { Card, Avatar, Button } from "flowbite-react";
import type { ChangeEvent } from "react";
import type { ProfileData } from "../../../services/userService";
import Sidebar from "../../../components/sidebar/index";
import Navbar from "../../../components/navbar/index";
export default function MyProfile() {
const dispatch = useAppDispatch();
const profile = useAppSelector((state) => state.profile);

const [formData, setFormData] = useState<ProfileData>({
firstName: "",
lastName: "",
email: "",
phone: "",
role: "",
});

const [errors, setErrors] = useState({
email: "",
phone: "",
});
const [sidebarOpen, setSidebarOpen] = useState(false);

const [editable, setEditable] = useState(false);
const [loading, setLoading] = useState(true);

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

  setFormData({
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

const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
const { name, value } = e.target;
setFormData((prev) => ({ ...prev, [name]: value }));
};

// ===== Validation =====
const validateEmail = (email: string) =>
/^[^\s@]+@[^\s@]+.[^\s@]+$/.test(email);

const validatePhone = (phone: string) => /^\d{10}$/.test(phone);

const validateForm = () => {
const newErrors = { email: "", phone: "" };


if (!validateEmail(formData.email))
  newErrors.email = "Enter a valid email address";

if (!validatePhone(formData.phone))
  newErrors.phone = "Phone number must be exactly 10 digits";

setErrors(newErrors);

return !newErrors.email && !newErrors.phone;


};

const handleSave = async () => {
if (!validateForm()) return;


try {
  const auth = getAuth();
  const user = auth.currentUser;
  if (!user) return;

  const updated = await userService.updateUserProfile({
    uid: user.uid,
    data: formData,
  });

  dispatch(setProfile({ uid: user.uid, ...updated }));

  setEditable(false);
  alert("Profile updated successfully!");
} catch (err) {
  console.error(err);
  alert("Failed to update profile.");
}

};

if (loading) return <p className="p-8">Loading profile...</p>;

// ===== Layout =====
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

        {/*PERSONAL INFO */}
        <Card className="shadow-lg bg-white! rounded-xl border-none">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-800  pb-2 font-serif  ">
              Personal Information
            </h3>

            <Button
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={editable ? handleSave : () => setEditable(true)}
            >
              {editable ? "Save" : "Edit"}
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

            {/* First Name */}
            <div>
              <p className="text-sm text-gray-500">First Name</p>
              {editable ? (
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.firstName}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <p className="text-sm text-gray-500">Last Name</p>
              {editable ? (
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.lastName}</p>
              )}
            </div>

            {/* Email */}
            <div>
              <p className="text-sm text-gray-500">Email</p>
              {editable ? (
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-md"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.email}</p>
              )}
              {errors.email && (
                <p className="text-red-500 text-sm">
                  {errors.email}
                </p>
              )}
            </div>

            {/* Phone */}
            <div>
              <p className="text-sm text-gray-500">Phone</p>
              {editable ? (
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.phone}</p>
              )}
              {errors.phone && (
                <p className="text-red-500 text-sm">
                  {errors.phone}
                </p>
              )}
            </div>
            {/*Role*/}
            <div>
              <p className="text-sm text-gray-500">Role</p>
              {editable ? (
                <input
                  className="w-full px-3 py-2 border rounded-md"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                />
              ) : (
                <p>{profile.role}</p>
              )}
            </div>


          </div>
        </Card>

      </main>
    </div>
  </div>
);


}
