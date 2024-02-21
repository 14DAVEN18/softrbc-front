import axios from "axios";
import { CREATE_USER } from "../constants/constants";

const config = {
    headers: {
        "Authorization": localStorage.getItem('token'),
        "Content-Type": "application/json"
    }
}

export const create = async ({
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
    }
}) => {
    try {
        return await axios.post(CREATE_USER, 
            {
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
                }
            }, config);
    } catch (error) {
        throw error;
    }
}

export const update = async ({
    usuario: {
        id,
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
    }
}) => {
    try {
        return await axios.put(`${CREATE_USER}/${id}`, 
        {
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
            }
        }, config);
    } catch (error) {
        throw error;
    }
}