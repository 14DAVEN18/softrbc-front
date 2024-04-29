import axios from "axios";
import { baseURL } from "../constants/constants";

export const getOptometrists = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/usuarios/listaOptometras`, config);
    } catch (error) {
        throw error;
    }
}


export const createOptometrist = async ({
    usuario: {
        nombre,
        apellido,
        direccion,
        correo,
        telefono,
        password,
        cedula,
    },
    idadmin
}) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.post(`${baseURL}/usuarios/nueva`, 
            {
                usuario: {
                    nombre,
                    apellido,
                    direccion,
                    correo,
                    telefono: telefono.toString(),
                    password,
                    cedula: cedula.toString(),
                },
                idadmin
            }, config);
    } catch (error) {
        throw error;
    }
}

export const updateOptometrist = async ({
    idadmin,
    id,
    direccion,
    correo,
    telefono,
}) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.put(`${baseURL}/usuarios/modificar/${id}`, 
            {
                idadmin,
                id,
                nuevadireccion: direccion,
                nuevocorreo: correo,
                nuevotelefono: telefono.toString(),
            }, config);
    } catch (error) {
        throw error;
    }
}

export const updateOptometristStatus = async ({
    idadmin,
    idusuario,
    idoptometra,
    }) => {
        try {
            const config = {
                headers: {
                    "Authorization": localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            }
            return await axios.put(`${baseURL}/usuarios/cambiarEstado`, {idadmin, idusuario, idoptometra}, config);
        } catch (error) {
            throw error;
        }
}