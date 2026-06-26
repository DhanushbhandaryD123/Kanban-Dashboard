import api from "../lib/api";

export const updateProfile = async (name) => {
  const { data } = await api.patch("/users/profile", { name });
  return data; // { success, message, user: { id, name, email, avatar, role } }
};
