import axios from "axios";

//http://localhost:5001/shopee-demo-c6d2b/us-central1/api
//https://us-central1-shopee-demo-c6d2b.cloudfunctions.net/api

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL, // api url(our cloud func)
  cancelToken: axios.CancelToken.source().token,
});

export default instance;
