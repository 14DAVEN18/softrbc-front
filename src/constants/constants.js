

// AUTH RELATED URLs
export const LOGIN_USER = 'http://localhost:8080/login'
export const VALIDATE_RECOVERY_KEY = 'http://localhost:8080/usuarios/verificarCodigoRecuperacion'
export const RESET_PASSWORD = 'http://localhost:8080/usuarios/actualizarContrasena'


// OPTOMETRIST RELATED URLs
export const GET_USER = 'http://localhost:8080/usuarios/listaOptometras'
export const CREATE_USER = "http://localhost:8080/usuarios/nueva"
export const MODIFY_USER = 'http://localhost:8080/usuarios/modificar'
export const UPDATE_USER_STATUS = 'http://localhost:8080/usuarios/cambiarEstado'


// PATIENT RELATED URLs
export const CREATE_PATIENT = "http://localhost:8080/paciente/nueva"

// CALENDAR RELATED URLs
export const CREATE_CALENDAR = 'http://localhost:8080/calendario/nueva'
export const CANCEL_DAY = 'http://localhost:8080/'
export const GET_APPOINTMENT_DURATION = 'http://localhost:8080/calendario/duracioncita'


// QUESTION RELATED URLs
export const GET_QUESTION = 'http://localhost:8080/preguntas/listaPreguntas'
export const CREATE_QUESTION = 'http://localhost:8080/preguntas/nueva'
export const MODIFY_QUESTION = 'http://localhost:8080/preguntas/modificar'
export const DELETE_QUESTION = 'http://localhost:8080/preguntas/eliminar'


// APPOINTMENT RELATED URLs
export const GET_APPOINTMENTS = 'http://localhost:8080/cita/lista' // Param
export const CREATE_APPOINTMENT = 'http://localhost:8080/cita/nueva'
export const VERIFY_APPOINTMENT = 'http://localhost:8080/cita/verificarCodigo' // Param
export const DELETE_APPOINTMENT = 'http://localhost:8080/cita/eliminar' // Path




export const USER_ALREADY_REGISTERED = "Ya tienes una cuenta asociada con ese correo electrónico..";
export const USER_DOES_NOT_EXIST = "No hay cuenta que coincida con las credeciales ingresadas.";
export const INVALID_PASSWORD = "La contraseña ingresada es invalida.";
export const USER_NOT_CREATED = "El usuario no se puedo crear.";
export const TRANSACTION_NOT_CREATED = 'No se puedo registrar el hecho económico.';
export const NO_TRANSACTIONS_LISTED = 'No existen transacciones que correspondan con el tipo seleccionado.';

export const USER_SUCCESSFULLY_REGISTERED = "El usuario ha sido registrado exitósamente.";
export const TRANSACTION_SUCCESSFULLY_REGISTERED = "El hecho económico fue registrado exitósamente.";
export const CREDENTIALS_SUCCESSFULLY_VALIDATED = "Las credenciales de usuario han sido validadas exitósamente.";




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
    },
    {
        key: '7',
        day: 'Domingo'
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