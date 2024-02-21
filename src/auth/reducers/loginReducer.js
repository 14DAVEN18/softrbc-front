export const loginReducer = (state = {}, action) => {
    
    switch(action.type) {
        case 'login':
            return {
                rol: action.payload.rol
            };
        case 'logout':
            return {
                rol: undefined
            };
        default:
            return state; 
    }
}