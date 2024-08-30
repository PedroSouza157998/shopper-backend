import { Router } from "express"
import ConfirmController from "../controllers/confirmController"
import { celebrate, Joi, Segments } from "celebrate"

const router = Router()
const confirmController = new ConfirmController()

router.patch('/', 
    celebrate({
    [Segments.BODY]: {
        "measure_uuid": Joi.string().required(),
        "measure_value": Joi.number().required()
    }
}),
confirmController.confirm)

export default router