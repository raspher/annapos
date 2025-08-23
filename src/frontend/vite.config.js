import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    server: {
        host: true,  // binds to 0.0.0.0
        port: process.env.FRONTEND_PORT || 5173
    }
})
