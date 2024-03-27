import { setCurrentLevel, setNewInput } from "./redux/chatbotActions";

const initialDecisionTree = {
    '1': {
        text: 'Preguntas frecuentes',
        options: optionsFor1
    },
    '2': {
        text: 'Citas de optometría',
        options: {
            '1': {
                authRequired: true,
                text: 'Agendar cita',
                action: () => {
                    navigate('/cliente/agendamiento')
                }
            },
            '2': {
                authRequired: true,
                text: 'Verificar detalles de cita',
                options: {
                    text: 'Por favor ingrese el código de la cita',
                    code: async (userMessage) => {
                        const query = {
                            idpaciente: JSON.parse(localStorage.getItem('user')).idpaciente,
                            codigo: userMessage
                        }
                        try {
                            const response = await verifyAppointmentDetails(query)
                            console.log("detalles: ", response.data)
                            addMessage({ text: `Fecha: ${response.data.fecha}`, sender: 'bot' })
                            addMessage({ text: `Hora : ${response.data.hora}`, sender: 'bot' })
                            addMessage({ text: '0. Menú principal '})
                            setNewInput(null)
                            setCurrentLevel(decisionTree)
                        } catch (error) {
                            addMessage({ text: error.response.data , sender: 'bot'})
                            console.error(error)
                        }
                        
                    }
                }
            },
            '3': {
                authRequired: true,
                text: 'Cancelar cita',
                options: {
                    text: 'Por favor ingrese el código de la cita',
                    code: async (userMessage) => {
                        const query = {
                            idpaciente: JSON.parse(localStorage.getItem('user')).idpaciente,
                            codigo: userMessage
                        }
                        try {
                            const response = await verifyAppointmentDetails(query)
                            console.log("detalles: ", response.data)
                            addMessage({ text: `Estimado(a) ${response.data.nombre}, estos son los detalles de su cita:` , sender: 'bot'})
                            addMessage({ text: `Fecha: ${response.data.fecha}`, sender: 'bot' })
                            addMessage({ text: `Hora : ${response.data.hora}`, sender: 'bot' })
                            addMessage({ text: '0. Menú principal '})
                        } catch (error) {
                            console.error(error)
                        }
                        
                    }
                }
            }
        }
    }
};