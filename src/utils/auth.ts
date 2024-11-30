import { jwtDecode } from "jwt-decode";

export const isUserLoggedIn = (): boolean => {
  const token = localStorage.getItem("token");

  if (!token) {
    return false;
  }

  if (token) {
    try {
      const decodedToken: { username: string; exp: number } = jwtDecode(token);
      const tokenExpiration = new Date(decodedToken.exp * 1000);

      if (tokenExpiration < new Date()) {
        localStorage.removeItem("token");
        return false;
      }

      if (tokenExpiration > new Date()) {
        return true;
      }
    } catch (error) {
      console.error("Error decoding token:", error);
      return false;
    }
  }

  return false;
};
