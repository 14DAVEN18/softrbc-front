import axios from "axios";
import { VALIDATE_RECOVERY_KEY, RESET_PASSWORD } from "../constants/constants"

export const recoveryAccount = async ({correo, codigorecuperacion}) => {

    const queryParams = `?correo=${correo}&codigorecuperacion=${codigorecuperacion}`;
    try {
        return await axios.get(`${VALIDATE_RECOVERY_KEY}${queryParams}`);
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async ({
    correo,
    password
}) => {
    try {
        return await axios.put(RESET_PASSWORD, 
            {
                correo: correo,
                nuevacontrasena: password,
            });
    } catch (error) {
        throw error;
    }
}