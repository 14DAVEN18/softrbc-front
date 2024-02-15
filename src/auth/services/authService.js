import axios from "axios";
import { LOGIN_USER } from "../../constants/constants"

export const loginUser = async ({correo, password}) => {
    try {
        return await axios.post (LOGIN_USER, {
            correo,
            password,
        })
    } catch (error) {
        throw error;
    }
}