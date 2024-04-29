const initialState = {
    messages: [
        { text: 'Bienvenido al Palacio de las Gafas. Digite el número de opción que corresponda para navegar.', sender: 'bot' },
        { text: 'Para navegar, digite el número que corresponda con la opción que desea seleccionar.', sender: 'bot' },
        { text: 'También puede digitar 0 en cualquier momento si desea retornar al menú principal.', sender: 'bot' },
        { text: '¿En qué podemos ayudarle?', sender: 'bot' },
        { text: '1. Preguntas frecuentes', sender: 'bot' },
        { text: '2. Citas de optometría', sender: 'bot' }
    ],
    displayLogin: false,
    decisionTree: null,
    currentLevel: null,
    input: null
};

const chatbotReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_MESSAGE':
            return {
                ...state,
                messages: [...state.messages, action.payload],
            };
        case 'RESET_MESSAGE':
            return {
                ...state,
                messages: action.payload
            }
        case 'SET_DISPLAY_LOGIN':
            return {
                ...state,
                displayLogin: action.payload,
            };
        case 'SET_DECISION_TREE':
            return {
                ...state,
                decisionTree: action.payload,
            };
        case 'SET_CURRENT_LEVEL':
            return {
                ...state,
                currentLevel: action.payload,
            };
        case 'SET_NEW_INPUT':
            return {
                ...state,
                input: action.payload
            }
        default:
            return state;
    }
};

export default chatbotReducer;