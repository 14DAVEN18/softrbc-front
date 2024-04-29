import axios from "axios";
import { baseURL } from "../constants/constants";

export const getPatientById = async (idpaciente) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${baseURL}/paciente/pacienteEncontrado/${idpaciente}`, config);
    } catch (error) {
        throw error;
    }
}


export const createPatient = async ({
    usuario: {
        nombre,
        apellido,
        direccion,
        correo,
        telefono,
        password,
        cedula
    },
    paciente: {
        ocupacion,
        fechanacimiento,
        genero,
        nombreacompañante,
        aceptarterminos
    }
}) => {
    try {
        return await axios.post(`${baseURL}/paciente/nueva`, 
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
                paciente: {
                    ocupacion,
                    fechanacimiento,
                    genero,                    
                    nombreacompañante,
                    aceptarterminos
                }
            });
    } catch (error) {
        throw error;
    }
}

export const updatePatient = async ({
    usuario: {
        idusuario,
        nombre,
        apellido,
        correo,
        direccion,
        telefono,
        cedula
    },
    paciente:{
        idpaciente,
        ocupacion,
        fechanacimiento,
        genero
    },
    idoptometra
}) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.put(`${baseURL}/paciente/actualizar`, 
            {
                usuario: {
                    idusuario: idusuario,
                    nombre: nombre,
                    apellido: apellido,
                    correo: correo,
                    direccion: direccion,
                    telefono: telefono,
                    cedula: cedula
                },
                paciente:{
                    idpaciente: idpaciente,
                    ocupacion: ocupacion,
                    fechanacimiento: fechanacimiento,
                    genero: genero
                },
                idoptometra
            }, config);
    } catch (error) {
        throw error;
    }
}