import axios from "axios";
import { redirect, type LoaderFunctionArgs } from "react-router";

interface AuthProvider {
  isAuthenticated: boolean;
  token: null | string;
  signin(username: string): Promise<void>;
  signout(): Promise<void>;
}


export const authProvider: AuthProvider = {
  isAuthenticated: !!localStorage.getItem("access_token"),
  token: localStorage.getItem("access_token"),

  async signin(token: string) {
    try {
      const res = await axios.post("http://127.0.0.1:8000/verify_token", { token });
      if (res.data?.access_token) {
        this.isAuthenticated = true;
        this.token = res.data.access_token;
        localStorage.setItem("access_token", res.data.access_token);
      } else {
        throw new Error("Invalid token");
      }
    } catch (err) {
      this.isAuthenticated = false;
      this.token = null;
      localStorage.removeItem("access_token");
      throw new Error("Invalid token");
    }
  },

  async signout() {
    this.isAuthenticated = false;
    this.token = null;
    localStorage.removeItem("access_token");
  },
};

export async function loginAction({ request }: LoaderFunctionArgs) {
  const formData = await request.formData();
  const token = formData.get("token") as string | null;

  if (!token) {
    return redirect("/?error=missing_token");
  }

  try {
    await authProvider.signin(token);
    return redirect("/home");
  } catch (error) {
    return redirect("/?error=invalid_token");
  }
}

export function protectedLoader() {
  const token = localStorage.getItem("access_token");
  if (!token || !authProvider.isAuthenticated) {
    return redirect("/?error=unauthorized");
  }
  return null;
}