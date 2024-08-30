import { injectable } from "tsyringe";
import MeasuresRepository from "../repositories/measure.repository";
import { ServiceResponse } from "../utils/types";

interface IExecuteProps {
    measure_uuid: string;
    measure_value: number;
}

@injectable()
export default class UploadImagesService {
    private ormRepository;
    constructor() {
        this.ormRepository = new MeasuresRepository()

    }

    async execute({
        measure_uuid,
        measure_value,
    }: IExecuteProps): Promise<ServiceResponse> {

        try {

            const measure = await this.ormRepository.findById(measure_uuid)
            if(!measure) {
                return {
                    success: false,
                    code: 404,
                    data: {
                        error_code: "MEASURE_NOT_FOUND",
                        error_description: "Leitura do mês já realizada"
                    }
                }
            } else {
                if(measure.has_confirmed) {
                    return {
                        success: false,
                        code: 409,
                        data: {
                            error_code: "CONFIRMATION_DUPLICATE",
                            error_description: "Leitura do mês já realizada"
                        }
                    }
                }
            }
            await this.ormRepository.update({measure_uuid, measure_value})
            return {
                success: true,
                code: 200,
                data: {
                    success: true
                }
            }
        } catch (error) {
           throw new Error("Houve um problema imprevisto no upload de imagens!")
        }
    }
}