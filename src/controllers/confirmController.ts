import { Request, Response } from "express"
import {container} from "tsyringe";
import ConfirmImagesService from "../services/confirmImageService";


export default class ConfirmController {
    async confirm(request: Request, response: Response) {
        
        const {
            measure_uuid,
            measure_value
        } = request.body

        
        const confirmImagesService = container.resolve(ConfirmImagesService)
        
        try {
            const result = await confirmImagesService.execute({
                measure_uuid,
                measure_value
            })
            
            response.status(result.code).json(result.data)
        } catch (error) {
            response.json({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: "Try again later."

            })
        }

        // response.json({message: "Sucesso!"})
    }
}