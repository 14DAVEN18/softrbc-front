export const addMessage = (message) => ({
    type: 'ADD_MESSAGE',
    payload: message,
});

export const resetMessage = () => ({
    type: 'RESET_MESSAGE',
    payload: [
        { text: 'Bienvenido al Palacio de las Gafas. Digite el número de opción que corresponda para navegar.', sender: 'bot' },
        { text: 'Puede digitar 0 en cualquier momento si desea retornar al menú principal.', sender: 'bot' },
        { text: '¿En qué podemos ayudarle?', sender: 'bot' },
        { text: '1. Preguntas frecuentes', sender: 'bot' },
        { text: '2. Citas de optometría', sender: 'bot' }
    ]
})
  
export const setDisplayLogin = (display) => ({
    type: 'SET_DISPLAY_LOGIN',
    payload: display,
});

export const setDecisionTree = (tree) => ({
    type: 'SET_DECISION_TREE',
    payload: tree
});

export const setCurrentLevel = (level) => ({
    type: 'SET_CURRENT_LEVEL',
    payload: level,
});

export const setNewInput = (input) => ({
    type: 'SET_NEW_INPUT',
    payload: input
});