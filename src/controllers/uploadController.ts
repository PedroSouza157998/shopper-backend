import { Request, Response } from "express"
import {container} from "tsyringe";
import UploadImagesService from "../services/uploadImageService";


export default class UploadController {
    async upload(request: Request, response: Response) {
        
        const {
            image,
            measure_type,
            customer_code,
            measure_datetime
        } = request.body

        
        const uploadImagesService = container.resolve(UploadImagesService)
        
        try {
            const result = await uploadImagesService.execute({
                image,
                measure_type,
                customer_code,
                measure_datetime
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