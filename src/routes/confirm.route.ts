import { Router } from "express"
import MeasureController from "../controllers/measureController"
import { celebrate, Joi, Segments } from "celebrate"

const router = Router()
const measureController = new MeasureController()

router.patch('/confirm', 
    celebrate({
    [Segments.BODY]: {
        "measure_uuid": Joi.string().required(),
        "measure_value": Joi.number().required()
    }
}),
measureController.confirm)

export default router