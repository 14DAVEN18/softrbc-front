import axios from "axios";
import { baseURL } from "../constants/constants";

export const getAppointmentsDuration = async (dia) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/calendario/duracioncita/${dia}`, config);
    } catch (error) {
        throw error;
    }
}


export const getAppointments = async (date) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/cita/listacitas?fecha=${date}`, config);
    } catch (error) {
        throw error;
    }
}


export const getAppointmentTimes = async (date) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/cita/lista?fecha=${date}`, config);
    } catch (error) {
        throw error;
    }
}


export const createAppointment = async ({
    fecha,
    hora,
    idpaciente,
    nombre,
    telefono,
    correo
}) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.post(`${baseURL}/cita/nueva`, 
            {
                fecha,
                hora,
                idpaciente,
                nombre,
                telefono,
                correo
            }, config);
    } catch (error) {
        throw error;
    }
}

export const verifyAppointmentDetails = async (query) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/cita/verificarCodigo?idpaciente=${query.idpaciente}&codigo=${query.codigo}`, config);
    } catch (error) {
        throw error;
    }
}

export const cancelAppointment = async (codigo) => {
    
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.delete(`${baseURL}/cita/eliminar/${codigo}`, config);
    } catch (error) {
        throw error;
    }
}

export const getCanceledAppointments = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/cita/listacitasInactivas`, config);
    } catch (error) {
        throw error;
    }
}