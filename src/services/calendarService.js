import axios from "axios";
import { CREATE_CALENDAR, CANCEL_DAY } from "../constants/constants";


export const createCalendar = async (idoptometra, diasatencion, duracion) => {
    console.log("idoptometra: ", idoptometra)
    console.log("diasatencion: ", diasatencion)
    console.log("duracion: ", duracion)
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.post(CREATE_CALENDAR, {
            idoptometra,
            diasatencion,
            duracion
        }, config)
    } catch (error) {
        throw error;
    }
}

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