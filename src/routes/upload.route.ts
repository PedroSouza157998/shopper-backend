import { Router } from "express"
import UploadController from "../controllers/uploadController"
import { celebrate, Joi, Segments } from "celebrate"

const router = Router()
const uploadController = new UploadController()

router.post('/', 
    celebrate({
    [Segments.BODY]: {
        "image": Joi.string().required(),
        "customer_code": Joi.string().required(),
        "measure_type": Joi.string().allow("WATER", "GAS").required(),
        "measure_datetime": Joi.string().required()
    }
}),
uploadController.upload)

export default router