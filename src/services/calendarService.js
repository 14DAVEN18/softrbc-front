import axios from "axios";
import { baseURL } from "../constants/constants";


export const getCalendars = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/calendario/calendariolista`, config);
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
        return await axios.get(`${baseURL}/calendario/calendariooptometra`, config)
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
        return await axios.post(`${baseURL}/calendario/nueva`, {
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
        const response = await axios.put(`${baseURL}/calendario/modificar/${idcalendario}`, 
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
        const response = await axios.get(`${baseURL}/cita/export/pdf?fecha=${fecha}`, config);
        return response;
    } catch (error) {
        throw error;
    }
}