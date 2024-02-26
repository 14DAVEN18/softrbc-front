import axios from "axios";
import { CREATE_USER, GET_USER } from "../constants/constants";

export const getOptometrists = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        console.log(localStorage.getItem('token'))
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
    }
}) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        console.log(localStorage.getItem('token'))
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
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
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