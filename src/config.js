// Dirección del backend: en Vercel viene de la variable VITE_API_URL
// y en el computador usa localhost:8000.
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';