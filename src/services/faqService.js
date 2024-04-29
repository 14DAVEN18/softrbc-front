import axios from "axios";
import { baseURL } from "../constants/constants";

export const getQuestions = async () => {
    try {
        return await axios.get(`${baseURL}/preguntas/listaPreguntas`);
    } catch (error) {
        throw error;
    }
}


export const createQuestion = async ({
    idadmin,
    pregunta,
    respuesta
}) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.post(`${baseURL}/preguntas/nueva`, 
            {
                idadmin,
                pregunta,
                respuesta
            }, config);
    } catch (error) {
        throw error;
    }
}

export const updateQuestion = async ({
    idadmin,
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
        return await axios.put(`${baseURL}/preguntas/modificar/${id}`, 
        {
            idadmin,
            id,
            pregunta,
            respuesta
        }, config);
    } catch (error) {
        throw error;
    }
}

export const deleteQuestion = async (idpregunta, idadmin) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.delete(`${baseURL}/preguntas/eliminar?id=${idpregunta}&idadmin=${idadmin}`, config);
    } catch (error) {
        throw error;
    }
}
