import { Request, Response } from "express"
import {container} from "tsyringe";
import UploadImagesService from "../services/uploadImageService";
import ConfirmImagesService from "../services/confirmImageService";
import ListImagesService from "../services/listImageService";


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

    }

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

    }

    async list(request: Request, response: Response) {
        
        const {
            customer_code
        } = request.params

        const {
            measure_type
        } = request.query

        const listImagesService = container.resolve(ListImagesService)
        
        try {
            const result = await listImagesService.execute({
                customer_code,
                measure_type: measure_type as string
            })
            
            response.status(result.code).json(result.data)
        } catch (error) {
            response.json({
                error_code: "INTERNAL_SERVER_ERROR",
                error_description: "Try again later."

            })
        }

    }
}