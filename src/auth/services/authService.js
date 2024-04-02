import axios from "axios";
import { LOGIN_USER } from "../../constants/constants"

export const loginUser = async ({cedula, password}) => {
    try {
        return await axios.post (LOGIN_USER, {
            cedula,
            password,
        })
    } catch (error) {
        throw error;
    }
}