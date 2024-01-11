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

export const LOGIN_USER = "http://localhost:4000/api/users/user"
export const CREATE_USER = "http://localhost:4000/api/users/users"
export const CREATE_TRANSACTION = 'http://localhost:4000/api/transactions/transactions'
export const GET_TRANSACTIONS = 'http://localhost:4000/api/transactions/transactions'


export const USER_ALREADY_REGISTERED = "Ya tienes una cuenta asociada con ese correo electrónico..";
export const USER_DOES_NOT_EXIST = "No hay cuenta que coincida con las credeciales ingresadas.";
export const INVALID_PASSWORD = "La contraseña ingresada es invalida.";
export const USER_NOT_CREATED = "El usuario no se puedo crear.";
export const TRANSACTION_NOT_CREATED = 'No se puedo registrar el hecho económico.';
export const NO_TRANSACTIONS_LISTED = 'No existen transacciones que correspondan con el tipo seleccionado.';

export const USER_SUCCESSFULLY_REGISTERED = "El usuario ha sido registrado exitósamente.";
export const TRANSACTION_SUCCESSFULLY_REGISTERED = "El hecho económico fue registrado exitósamente.";
export const CREDENTIALS_SUCCESSFULLY_VALIDATED = "Las credenciales de usuario han sido validadas exitósamente.";