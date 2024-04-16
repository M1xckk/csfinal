// utils/api.ts
import { useKindeAuth } from "@kinde-oss/kinde-auth-react";

export const useApi = () => {
  const { getToken } = useKindeAuth();

  const fetchApi = async (url: string, options = {}) => {
    const token = await getToken();
    const response = await fetch(import.meta.env.VITE_APP_API_URL + url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `${token}`,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  return { fetchApi };
};
