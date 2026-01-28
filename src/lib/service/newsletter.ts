import { axiosInstance } from "../utils/axios-instant";
import { apiCall } from "../utils/error-handler";

export async function subscribeToNewsletter(email: string) {
  return apiCall(
    () => axiosInstance.post("/api/newsletter/subscribe", { email }),
    {
      onError: "toast",
      errorMessage: "Failed to subscribe to newsletter",
    },
  ).then((res) => res.data);
}
