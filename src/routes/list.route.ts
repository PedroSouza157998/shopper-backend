import { Router } from "express"
import MeasureController from "../controllers/measureController"
import { celebrate, Joi, Segments } from "celebrate"

const router = Router()
const measureController = new MeasureController()

router.get('/:customer_code/list',
    celebrate({
        [Segments.PARAMS]: {
            customer_code: Joi.string().required(),
        }
    }),
    measureController.list)

export default router