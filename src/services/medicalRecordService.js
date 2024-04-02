import axios from "axios";
import { CREATE_MEDICAL_RECORD } from "../constants/constants";


export const createMedicalRecord = async (
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
            control
        },
        paciente: {
            idpaciente
        }
    }
) => {
    try {
        return await axios.post(CREATE_MEDICAL_RECORD, 
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
                    control
                },
                paciente: {
                    idpaciente
                }
            });
    } catch (error) {
        throw error;
    }
}
