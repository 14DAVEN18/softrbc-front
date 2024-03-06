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
        return await axios.get(GET_QUESTION, config);
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
    idpregunta,
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
        return await axios.put(`${MODIFY_QUESTION}/${idpregunta}`, 
        {
            idpregunta,
            pregunta,
            respuesta
        }, config);
    } catch (error) {
        throw error;
    }
}

export const deleteQuestion = async (idpregunta) => {
    console.log(idpregunta)
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.put(DELETE_QUESTION, idpregunta, config);
    } catch (error) {
        throw error;
    }
}
