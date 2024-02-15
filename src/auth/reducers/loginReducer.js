export const loginReducer = (state = {}, action) => {
    
    switch(action.type) {
        case 'login':
            return {
                isAuth: true,
                rol: action.payload.rol,
                correo: action.payload.correo
            };
        case 'logout':
            return {
                isAuth: false,
                rol: false,
                correo: undefined
            };
        default:
            return state; 
    }
}