import axios from "axios";
import { GET_APPOINTMENT_DURATION, CREATE_APPOINTMENT } from "../constants/constants";

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


export const createAppointment = async ({
    fecha,
    hora,
    idpaciente,
    nombre,
    telefono
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
                telefono
            }, config);
    } catch (error) {
        throw error;
    }
}

export const updateQuestion = async ({
    id,
    pregunta,
    respuesta
}) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.put(`${GET_APPOINTMENT_DURATION}/${id}`, 
        {
            id,
            pregunta,
            respuesta
        }, config);
    } catch (error) {
        throw error;
    }
}

export const deleteQuestion = async (idpregunta) => {
    console.log(id)
    const id = idpregunta
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.delete(`${GET_APPOINTMENT_DURATION}/${id}`, config);
    } catch (error) {
        throw error;
    }
}
