import { defineConfig } from "cypress";

export default defineConfig({
  projectId: "gpu1bc",
  e2e: {
    baseUrl: "http://localhost:5173/",
  },
});
