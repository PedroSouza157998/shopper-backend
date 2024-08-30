import { Router } from "express"
import MeasureController from "../controllers/measureController"
import { celebrate, Joi, Segments } from "celebrate"

const router = Router()
const measureController = new MeasureController()

router.post('/upload', 
    celebrate({
    [Segments.BODY]: {
        "image": Joi.string().base64().required(),
        "customer_code": Joi.string().required(),
        "measure_type": Joi.string().valid("WATER", "GAS").required(),
        "measure_datetime": Joi.string().required()
    }
}),
measureController.upload)

export default router