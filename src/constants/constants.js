export const durations = [
    {
        key: '1',
        duration: '10 minutos'
    },
    {
        key: '2',
        duration: '15 minutos'
    },
    {
        key: '3',
        duration: '20 minuots'
    },
    {
        key: '4',
        duration: '25 minutos'
    },
    {
        key: '5',
        duration: '30 minutos'
    }
];

export const days = [
    {
        key: '1',
        day: 'Lunes'
    },
    {
        key: '2',
        day: 'Martes'
    },
    {
        key: '3',
        day: 'Miercoles'
    },
    {
        key: '4',
        day: 'Jueves'
    },
    {
        key: '5',
        day: 'Viernes'
    },
    {
        key: '6',
        day: 'Sábado'
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

export const years = [
    '2015',
    '2016',
    '2017',
    '2018',
    '2019',
    '2020',
    '2021',
    '2022'
]

// USER RELATED URLS
export const LOGIN_USER = "http://localhost:8080/login"
export const CREATE_USER = "http://localhost:8080/usuarios/nueva"
export const GET_USER = 'http://localhost:8080/usuarios/listaOptometras'
export const MODIFY_USER = 'http://localhost:8080/usuarios/modificar'
export const UPDATE_USER_STATUS = 'http://localhost:8080/usuarios/cambiarEstado'

// CALENDAR RELATED URLS
export const CANCEL_DAY = 'http://localhost:8080/'




export const USER_ALREADY_REGISTERED = "Ya tienes una cuenta asociada con ese correo electrónico..";
export const USER_DOES_NOT_EXIST = "No hay cuenta que coincida con las credeciales ingresadas.";
export const INVALID_PASSWORD = "La contraseña ingresada es invalida.";
export const USER_NOT_CREATED = "El usuario no se puedo crear.";
export const TRANSACTION_NOT_CREATED = 'No se puedo registrar el hecho económico.';
export const NO_TRANSACTIONS_LISTED = 'No existen transacciones que correspondan con el tipo seleccionado.';

export const USER_SUCCESSFULLY_REGISTERED = "El usuario ha sido registrado exitósamente.";
export const TRANSACTION_SUCCESSFULLY_REGISTERED = "El hecho económico fue registrado exitósamente.";
export const CREDENTIALS_SUCCESSFULLY_VALIDATED = "Las credenciales de usuario han sido validadas exitósamente.";