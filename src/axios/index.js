import axios from "axios";
import { useStore } from 'vuex'

const store = useStore()

const api = axios.create({
    baseURL: `${import.meta.env.VITE_api}`,
});

export default api