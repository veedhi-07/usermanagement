import { seedUsers } from "../data/seedUsers";

export const seedData = () => {
  const existingUsers = localStorage.getItem("users");

  // Only seed if no users exist
  if (!existingUsers) {
    localStorage.setItem("users", JSON.stringify(seedUsers));
    console.log("Seed users added!");
  }
};
