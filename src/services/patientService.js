import axios from "axios";
import { CREATE_PATIENT, GET_PATIENT_BY_ID, UPDATE_PATIENT } from "../constants/constants";

export const getPatients = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(CREATE_PATIENT, config);
    } catch (error) {
        throw error;
    }
}


export const getPatientById = async (idpaciente) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${GET_PATIENT_BY_ID}/${idpaciente}`, config);
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
        return await axios.post(CREATE_PATIENT, 
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
        return await axios.put(`${UPDATE_PATIENT}`, 
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

export const updatePatientStatus = async (id) => {
    console.log(id)
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.put(`${CREATE_PATIENT}/${id}`, id, config);
    } catch (error) {
        throw error;
    }
}
