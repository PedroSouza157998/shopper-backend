import { injectable } from "tsyringe";
import MeasuresRepository from "../repositories/measure.repository";
import { ServiceResponse } from "../utils/types";

interface IExecuteProps {
    customer_code: string;
    measure_type?: string;
}

@injectable()
export default class ListImagesService {
    private ormRepository;
    constructor() {
        this.ormRepository = new MeasuresRepository()

    }

    async execute({
        customer_code,
        measure_type,
    }: IExecuteProps): Promise<ServiceResponse> {

        try {

            if(measure_type && (typeof measure_type !== 'string' || !["GAS", "WATER"].includes(measure_type?.toUpperCase()))) {
                return {
                    success: false,
                    code: 400,
                    data: {
                        error_code: "INVALID_TYPE",
                        error_description: "Tipo de medição não permitida"
                    }
                }
            }

            const measures = await this.ormRepository.findAll(measure_type ? { customer_code, measure_type } : { customer_code } )
            console.log(measures)
            if (measures.length)
                return {
                    success: true,
                    code: 200,
                    data: {
                        customer_code,
                        measures
                    }
                }
            else 
                return {
                    success: false,
                    code: 404,
                    data: {
                        error_code: "MEASURES_NOT_FOUND",
                        error_description: "Nenhuma leitura encontrada"
                    }
                }
            // if(!measure) {
            //     return {
            //         success: false,
            //         code: 404,
            //         data: {
            //             error_code: "MEASURE_NOT_FOUND",
            //             error_description: "Leitura do mês já realizada"
            //         }
            //     }
            // } else {
            //     if(measure.has_confirmed) {
            //         return {
            //             success: false,
            //             code: 409,
            //             data: {
            //                 error_code: "CONFIRMATION_DUPLICATE",
            //                 error_description: "Leitura do mês já realizada"
            //             }
            //         }
            //     }
            // }
            // await this.ormRepository.update({measure_uuid, measure_value})
            // return {
            //     success: true,
            //     code: 200,
            //     data: {
            //         success: true
            //     }
            // }
        } catch (error) {
            throw new Error("Houve um problema imprevisto no upload de imagens!")
        }
    }
}