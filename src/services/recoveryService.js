import axios from "axios";
import { VALIDATE_RECOVERY_KEY } from "../constants/constants"

export const recoveryAccount = async ({correo, recoverykey}) => {
    try {
        return await axios.post (VALIDATE_RECOVERY_KEY, {
            correo,
            recoverykey,
        })
    } catch (error) {
        throw error;
    }
}

export const resetPassword = async ({correo, recoverykey}) => {
    try {
        return await axios.post (VALIDATE_RECOVERY_KEY, {
            correo,
            recoverykey,
        })
    } catch (error) {
        throw error;
    }
}