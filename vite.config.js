import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // REPLACE 'YOUR_REPO_NAME' with your actual GitHub repository name, e.g. '/knights-tactics/'
  base: "/knights-and-bolts-idle-tactics/",
})