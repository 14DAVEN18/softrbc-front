



// AUTH RELATED URLs
export const LOGIN_USER = 'http://20.84.118.153:8080/login'
export const VALIDATE_RECOVERY_KEY = 'http://20.84.118.153:8080/usuarios/verificarCodigoRecuperacion'
export const RESET_PASSWORD = 'http://20.84.118.153:8080/usuarios/actualizarContrasena'


// OPTOMETRIST RELATED URLs
export const GET_USER = 'http://20.84.118.153:8080/usuarios/listaOptometras'
export const CREATE_USER = "http://20.84.118.153:8080/usuarios/nueva"
export const MODIFY_USER = 'http://20.84.118.153:8080/usuarios/modificar'
export const UPDATE_USER_STATUS = 'http://20.84.118.153:8080/usuarios/cambiarEstado'


// PATIENT RELATED URLs
export const CREATE_PATIENT = "http://20.84.118.153:8080/paciente/nueva"
export const GET_PATIENT_BY_ID = 'http://20.84.118.153:8080/paciente/pacienteEncontrado'
export const UPDATE_PATIENT = "http://20.84.118.153:8080/paciente/actualizar"
export const FIND_PATIENT_MEDICAL_RECORDS = 'http://20.84.118.153:8080/HistoriaClinica/buscarHistoria'

// CALENDAR RELATED URLs
export const GET_CALENDARS = 'http://20.84.118.153:8080/calendario/calendariolista'
export const CREATE_CALENDAR = 'http://20.84.118.153:8080/calendario/nueva'
export const MODIFY_CALENDAR = 'http://20.84.118.153:8080/calendario/modificar'
export const GET_APPOINTMENT_DURATION = 'http://20.84.118.153:8080/calendario/duracioncita'
export const GET_DAYS_OPTOMETRIST = 'http://20.84.118.153:8080/calendario/calendariooptometra'


// QUESTION RELATED URLs
export const GET_QUESTION = 'http://20.84.118.153:8080/preguntas/listaPreguntas'
export const CREATE_QUESTION = 'http://20.84.118.153:8080/preguntas/nueva'
export const MODIFY_QUESTION = 'http://20.84.118.153:8080/preguntas/modificar'
export const DELETE_QUESTION = 'http://20.84.118.153:8080/preguntas/eliminar'


// APPOINTMENT RELATED URLs
export const GET_APPOINTMENTS_TIME = 'http://20.84.118.153:8080/cita/lista' // Param Retorna solo horas por fecha
export const GET_APPOINTMENTS = 'http://20.84.118.153:8080/cita/listacitas' // Param Retorna un array de listas completas
export const CREATE_APPOINTMENT = 'http://20.84.118.153:8080/cita/nueva'
export const VERIFY_APPOINTMENT = 'http://20.84.118.153:8080/cita/verificarCodigo' // Param
export const DELETE_APPOINTMENT = 'http://20.84.118.153:8080/cita/eliminar' // Path
export const CANCEL_DAY = 'http://20.84.118.153:8080/cita/export/pdf' // Param
export const GET_CANCELED_APPOINTMENTS = 'http://20.84.118.153:8080/cita/listacitasInactivas'

// CHANGELOG RELATED URLs
export const GET_CHANGELOG = 'http://20.84.118.153:8080/auditoria/informacion'



// MEDICAL RECORD URLs
export const CREATE_MEDICAL_RECORD = 'http://20.84.118.153:8080/HistoriaClinica/crearhistoria'
export const ADD_MEDICAL_RECORD = 'http://20.84.118.153:8080/HistoriaClinica/nueva'
export const GENERATE_PDF_FORMULA = 'http://20.84.118.153:8080/HistoriaClinica/generarFormula'




export const durations = [
    {
        key: 10,
        duration: '10 minutos'
    },
    {
        key: 15,
        duration: '15 minutos'
    },
    {
        key: 20,
        duration: '20 minutos'
    },
    {
        key: 25,
        duration: '25 minutos'
    },
    {
        key: 30,
        duration: '30 minutos'
    }
];

export const days = [
    {
        key: '1',
        day: 'lunes'
    },
    {
        key: '2',
        day: 'martes'
    },
    {
        key: '3',
        day: 'miercoles'
    },
    {
        key: '4',
        day: 'jueves'
    },
    {
        key: '5',
        day: 'viernes'
    },
    {
        key: '6',
        day: 'sabado'
    }
]

export const months = [
    { 
        key  : '01',
        month: 'Enero'
    },
    {
        key  : '02',
        month: 'Febrero'
    },
    {
        key  : '03',
        month: 'Marzo'
    },
    {
        key  : '04',
        month: 'Abril'
    },
    {
        key  : '05',
        month: 'Mayo'
    },
    {
        key  : '06',
        month: 'Junio'
    },
    {
        key  : '07',
        month: 'Julio'
    },
    {
        key  : '08',
        month: 'Agosto'
    },
    {
        key  : '09',
        month: 'Septiembre'
    },
    {
        key  : '10',
        month: 'Octubre'
    },
    {
        key  : '11',
        month: 'Noviembre'
    },
    {
        key  : '12',
        month: 'Diciembre'
    }
    
]