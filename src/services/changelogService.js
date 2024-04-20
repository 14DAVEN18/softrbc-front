import axios from "axios";
import { GET_CHANGELOG } from "../constants/constants";

export const getChangelog = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(GET_CHANGELOG, config);
    } catch (error) {
        throw error;
    }
}