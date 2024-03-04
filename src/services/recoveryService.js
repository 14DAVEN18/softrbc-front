import axios from "axios";
import { VALIDATE_RECOVERY_KEY, RESET_PASSWORD } from "../constants/constants"

export const recoveryAccount = async ({correo, codigorecuperacion}) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    const queryParams = `?correo=${correo}&codigorecuperacion=${codigorecuperacion}`;
    try {
        return await axios.get(`${VALIDATE_RECOVERY_KEY}${queryParams}`, config);
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async ({
    correo,
    recoveryKey
}) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.put(RESET_PASSWORD, 
            {
                correo: correo,
                nuevacontrasena: recoveryKey,
            }, config);
    } catch (error) {
        throw error;
    }
}