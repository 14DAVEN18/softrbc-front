import axios from "axios";
import { baseURL } from "../constants/constants"

export const recoveryAccount = async ({cedula, codigorecuperacion}) => {

    const queryParams = `?correo=${cedula}&codigorecuperacion=${codigorecuperacion}`;
    try {
        return await axios.get(`${baseURL}/usuarios/verificarCodigoRecuperacion${queryParams}`);
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async ({
    cedula,
    password
}) => {
    try {
        return await axios.put(`${baseURL}/usuarios/actualizarContrasena`,
            {
                cedula: cedula,
                nuevacontrasena: password,
            });
    } catch (error) {
        throw error;
    }
}