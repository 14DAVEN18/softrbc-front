import axios from "axios";
import { CREATE_QUESTION, GET_QUESTION, MODIFY_QUESTION, DELETE_QUESTION } from "../constants/constants";

export const getQuestions = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(GET_QUESTION);
    } catch (error) {
        throw error;
    }
}


export const createQuestion = async ({
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
                pregunta,
                respuesta
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
        return await axios.put(`${MODIFY_QUESTION}/${id}`, 
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
    const id = idpregunta
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.delete(`${DELETE_QUESTION}/${id}`, config);
    } catch (error) {
        throw error;
    }
}
