import axios from "axios";
import { GET_APPOINTMENTS_TIME, GET_APPOINTMENTS, GET_APPOINTMENT_DURATION, CREATE_APPOINTMENT, VERIFY_APPOINTMENT, DELETE_APPOINTMENT, GET_CANCELED_APPOINTMENTS } from "../constants/constants";

export const getAppointmentsDuration = async (dia) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${GET_APPOINTMENT_DURATION}/${dia}`, config);
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
        return await axios.get(`${GET_APPOINTMENTS}?fecha=${date}`, config);
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
        return await axios.get(`${GET_APPOINTMENTS_TIME}?fecha=${date}`, config);
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
        return await axios.post(CREATE_APPOINTMENT, 
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
        return await axios.get(`${VERIFY_APPOINTMENT}?idpaciente=${query.idpaciente}&codigo=${query.codigo}`, config);
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
        return await axios.delete(`${DELETE_APPOINTMENT}/${codigo}`, config);
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
        return await axios.get(GET_CANCELED_APPOINTMENTS, config);
    } catch (error) {
        throw error;
    }
}