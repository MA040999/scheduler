import axios from "axios";

// the baseURL should to point to localhost in development
// and your domain in production
const app = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? process.env.DOMAIN
      : "http://localhost:4000/",
  withCredentials: true,
});

export default app;
