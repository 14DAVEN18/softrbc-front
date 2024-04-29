import axios from "axios";
import { baseURL } from "../constants/constants";

export const getChangelog = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/auditoria/informacion`, config);
    } catch (error) {
        throw error;
    }
}