import axios from "axios";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // api url(our cloud func)
  cancelToken: axios.CancelToken.source().token,
  withCredentials: true, // for cookies
});

export default instance;
