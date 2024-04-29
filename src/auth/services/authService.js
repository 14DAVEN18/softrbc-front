import axios from "axios";
import { baseURL } from "../../constants/constants"

export const loginUser = async ({cedula, password}) => {
    try {
        return await axios.post (`${baseURL}/login`, {
            cedula,
            password,
        })
    } catch (error) {
        throw error;
    }
}