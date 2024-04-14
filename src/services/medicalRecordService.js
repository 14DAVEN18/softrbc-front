import axios from "axios";
import { CREATE_MEDICAL_RECORD, ADD_MEDICAL_RECORD, GENERATE_PDF_FORMULA, FIND_PATIENT_MEDICAL_RECORDS } from "../constants/constants";


export const createMedicalRecord = async () => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.post(CREATE_MEDICAL_RECORD, undefined, config);
    } catch (error) {
        throw error;
    }
}

export const addMedicalRecord = async (
    {
        Anamnesis: {
            anamnesis
        },
        Antecedentes: {
            antecedentesFamiliares,
            antecedentesOculares,
            antecedentesGenerales,
        },
        RxUso: {
            rxusood,
            rxusooi,
            rxusoadd,
        },
        VisionLejana: {
            vlejanarxod,
            vlejanarxoi,
            vlejanaod,
            vlejanaoi,
            distanciapupilar,
            externo
        },
        visionProxima: {
            vproximarxod,
            vproximarxoi,
            vproximaod,
            vproximaoi
        },
        Motilidad: {
            ducciones,
            versiones,
            ppc,
            ct6m,
            cm,
            ojodominante,
            manodominante
        },
        Oftalmoscopia: {
            oftalmoscopiaod,
            oftalmoscopiaoi
        },
        Queratometria: {
            queratometriaod,
            queratometriaoi
        },
        Retinoscopia: {
            retinoscopiaod,
            retinoscopiaoi
        },
        RxFinal: {
            rxfinalod,
            rxfinaloi,
            avl,
            avp,
            color,
            add,
            bif,
            uso,
            diagnostico,
            conducta,
            examinador,
            observaciones,
            control
        },
        paciente: {
            idpaciente,
            idoptometra
        },
        idhistoriaclinica
    }
) => {
    try {
        const config = {
            headers: {
                "Authorization": localStorage.getItem('token'),
                "Content-Type": "application/json"
            }
        }
        return await axios.post(ADD_MEDICAL_RECORD, 
            {
                Anamnesis: {
                    anamnesis
                },
                Antecedentes: {
                    antecedentesFamiliares,
                    antecedentesOculares,
                    antecedentesGenerales,
                },
                RxUso: {
                    rxusood,
                    rxusooi,
                    rxusoadd,
                },
                VisionLejana: {
                    vlejanarxod,
                    vlejanarxoi,
                    vlejanaod,
                    vlejanaoi,
                    distanciapupilar,
                    externo
                },
                visionProxima: {
                    vproximarxod,
                    vproximarxoi,
                    vproximaod,
                    vproximaoi
                },
                Motilidad: {
                    ducciones,
                    versiones,
                    ppc,
                    ct6m,
                    cm,
                    ojodominante,
                    manodominante
                },
                Oftalmoscopia: {
                    oftalmoscopiaod,
                    oftalmoscopiaoi
                },
                Queratometria: {
                    queratometriaod,
                    queratometriaoi
                },
                Retinoscopia: {
                    retinoscopiaod,
                    retinoscopiaoi
                },
                RxFinal: {
                    rxfinalod,
                    rxfinaloi,
                    avl,
                    avp,
                    color,
                    add,
                    bif,
                    uso,
                    diagnostico,
                    conducta,
                    examinador,
                    observaciones,
                    control
                },
                paciente: {
                    idpaciente,
                    idoptometra
                },
                idhistoriaclinica
            }, config);
    } catch (error) {
        throw error;
    }
}

export const generatePdfFormula = async ({
    rxfinalod,
    rxfinaloi,
    avl,
    avp,
    add,
    bif,
    uso,
    diagnostico,
    observaciones
}) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        },
        responseType: 'blob'
    }
    try {
        const response = await axios.get(`${GENERATE_PDF_FORMULA}?od=${rxfinalod}&oi=${rxfinaloi}&avl=${avl}&avp=${avp}&addicion=${add}&bif=${bif}&uso=${uso}&diagnostico=${diagnostico}&observaciones=${observaciones}`, config);
        return response.data
    } catch (error) {
        throw error;
    }
}

export const getAllMedicalRecordsById = async (cedula) => {
    const config = {
        headers: {
            "Authorization": localStorage.getItem('token'),
            "Content-Type": "application/json"
        }
    }
    try {
        return await axios.get(`${FIND_PATIENT_MEDICAL_RECORDS}/${cedula}`, config);
    } catch (error) {
        throw error;
    }
}