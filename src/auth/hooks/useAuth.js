import { useNavigate } from "react-router-dom";
import { useReducer } from "react";
import { loginReducer } from "../reducers/loginReducer";
import { loginUser } from "../services/authService";

const initialLogin = JSON.parse(localStorage.getItem('login')) || {
    rol: '',
}
export const useAuth = () => {

    const [login, dispatch] = useReducer(loginReducer, initialLogin);
    const navigate = useNavigate();

    const handlerLogin = async ({ cedula, password }) => {
        
        try {
            const response = await loginUser ({ cedula, password});
            const token = response.data.token; // body viene en el body
            const claims = JSON.parse(window.atob(token.split(".")[1]));
            const rol = claims.sub
            console.log(response)
            dispatch({
                type: 'login',
                payload: {rol}
            });
            localStorage.setItem('rol', rol);
            localStorage.setItem('token', `Bearer ${token}`)
            
            if (rol === 'ROLE_ADMIN') {
                localStorage.setItem('user', JSON.stringify({
                    'name': response.data.nombre,
                    'surname': response.data.apellido,
                    'telefono': response.data.telefono,
                    'correo': response.data.correo,
                    'idadmin': claims.idadmin
                }))
                navigate('/administrador');
            }
            else if (rol === 'ROLE_OPTOMETRA') {
                localStorage.setItem('user', JSON.stringify({
                    'name': response.data.nombre,
                    'surname': response.data.apellido,
                    'telefono': response.data.telefono,
                    'correo': response.data.correo,
                    'idoptometra': claims.idoptometra
                }))
                navigate('/optometra');
            }
            else {
                localStorage.setItem('user', JSON.stringify({
                    'name': response.data.nombre,
                    'surname': response.data.apellido,
                    'telefono': response.data.telefono,
                    'correo': response.data.correo,
                    'idpaciente': claims.idpaciente
                }))
                console.log('Rol: ', 'Es paciente')
            }
        } catch(error) {
            if (error.response?.status === 401 ) {
                throw new Error('Correo o contraseña incorrectos.')
            } else if (error.response?.status === 403) {
                throw new Error('No tiene acceso al recurso o no tiene permisos suficientes')
            } else {
                throw error;
            }
            
        }
    }

    const handlerLogout = () => {
        dispatch({
            type: 'logout',
        });
        localStorage.removeItem('token');
        localStorage.removeItem('login');
        localStorage.clear();
    }

    return {
        login,
        handlerLogin,
        handlerLogout
    }
}