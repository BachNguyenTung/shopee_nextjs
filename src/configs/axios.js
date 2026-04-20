import axios from "axios";

const instance = axios.create({
  // Stripe & server routes live under /api/stripe (leave unset for same-origin)
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL ?? '',
  cancelToken: axios.CancelToken.source().token,
  withCredentials: true, // for cookies
});

export default instance;
