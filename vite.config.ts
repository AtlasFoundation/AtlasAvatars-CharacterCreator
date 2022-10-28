import { defineConfig } from "vite"
import react from '@vitejs/plugin-react';


// See guide on how to configure Vite at:
// https://vitejs.dev/config/
export default defineConfig({
  resolve: {
    events: require.resolve('events'),
  },
  plugins: [react()]
})
