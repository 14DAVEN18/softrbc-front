import axios from "axios";
import { CREATE_USER, GET_USER, MODIFY_USER, UPDATE_USER_STATUS } from "../constants/constants";

export const getOptometrists = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(GET_USER, config);
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
    optometra: {
        numeroTarjeta
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
        return await axios.post(CREATE_USER, 
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
                optometra: {
                    numeroTarjeta
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
        return await axios.put(`${MODIFY_USER}/${id}`, 
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
        console.log('idadmin: ', idadmin)
        console.log('idusuario: ', idusuario)
        console.log('idoptometra: ', idoptometra)
        try {
            const config = {
                headers: {
                    "Authorization": localStorage.getItem('token'),
                    "Content-Type": "application/json"
                }
            }
            return await axios.put(UPDATE_USER_STATUS, {idadmin, idusuario, idoptometra}, config);
        } catch (error) {
            throw error;
        }
}
