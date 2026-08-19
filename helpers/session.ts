import { deleteCookie } from "cookies-next";

const SESSION_ENDPOINT = "/api/auth/session";

export const endSession = async () => {
  try {
    await fetch(SESSION_ENDPOINT, { method: "DELETE" });
  } catch {
    // The local cleanup below still has to happen even if the request fails.
  }
  localStorage.removeItem("socket_token");
  localStorage.removeItem("isLogin");
  localStorage.removeItem("is_registered");
  deleteCookie("isLogin");
};
