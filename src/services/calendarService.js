import axios from "axios";
import { GET_CALENDARS, GET_DAYS_OPTOMETRIST, CREATE_CALENDAR, MODIFY_CALENDAR, CANCEL_DAY } from "../constants/constants";


export const getCalendars = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(GET_CALENDARS, config);
    } catch (error) {
        throw error;
    }
}

export const getDaysOptometrist = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(GET_DAYS_OPTOMETRIST, config)
    } catch (error) {
        throw error;
    }
}

export const createCalendar = async (idadmin, idoptometra, diasatencion, duracioncita) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.post(CREATE_CALENDAR, {
            idadmin,
            idoptometra,
            diasatencion,
            duracioncita
        }, config)
    } catch (error) {
        throw error;
    }
}


export const updateCalendar = async ({
    idadmin,
    idcalendario,
    idoptometra,
    nuevadiasatencion,
    nuevaduracion
}) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        const response = await axios.put(`${MODIFY_CALENDAR}/${idcalendario}`, 
        {
            idadmin,
            idcalendario,
            idoptometra,
            nuevadiasatencion,
            nuevaduracion
        }, config);
        return response
    } catch (error) {
        throw error;
    }
}


export const cancelWorkDay = async (fecha) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        responseType: 'blob'
    }
    try {   
        const response = await axios.get(`${CANCEL_DAY}?fecha=${fecha}`, config);
        return response;
    } catch (error) {
        throw error;
    }
}