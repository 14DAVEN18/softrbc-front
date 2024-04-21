import axios from "axios";
import { CREATE_QUESTION, GET_QUESTION, MODIFY_QUESTION, DELETE_QUESTION } from "../constants/constants";

export const getQuestions = async () => {
    try {
        return await axios.get(GET_QUESTION);
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
        return await axios.post(CREATE_QUESTION, 
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
        return await axios.put(`${MODIFY_QUESTION}/${id}`, 
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
        return await axios.delete(`${DELETE_QUESTION}?id=${idpregunta}&idadmin=${idadmin}`, config);
    } catch (error) {
        throw error;
    }
}
