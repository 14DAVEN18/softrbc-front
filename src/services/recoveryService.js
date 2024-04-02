import axios from "axios";
import { VALIDATE_RECOVERY_KEY, RESET_PASSWORD } from "../constants/constants"

export const recoveryAccount = async ({cedula, codigorecuperacion}) => {

    const queryParams = `?correo=${cedula}&codigorecuperacion=${codigorecuperacion}`;
    try {
        return await axios.get(`${VALIDATE_RECOVERY_KEY}${queryParams}`);
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async ({
    cedula,
    password
}) => {
    try {
        return await axios.put(RESET_PASSWORD, 
            {
                cedula: cedula,
                nuevacontrasena: password,
            });
    } catch (error) {
        throw error;
    }
}