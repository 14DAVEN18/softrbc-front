import axios from "axios";
import { CANCEL_DAY } from "../constants/constants";

export const cancelWorkDay = async (day) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.delete(`${CANCEL_DAY}`, day, config);
    } catch (error) {
        throw error;
    }
}