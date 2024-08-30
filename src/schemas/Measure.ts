import { Schema, Model, HydratedDocument, connect, model } from 'mongoose';
import { injectable } from 'tsyringe';

export interface IMeasureSchema {
    measure_uuid: string,
    measure_datetime: Date,
    measure_type: string,
    measure_value: number,
    has_confirmed:boolean,
    image_url: string,
    customer_code: string
}

const Measure = new Schema<IMeasureSchema>(
  {
    measure_uuid: { type: String, required: true },
    measure_datetime: { type: Date, required: true },
    measure_type: { type: String, required: true },
    measure_value: { type: Number, required: true },
    has_confirmed: { type: Boolean, required: true },
    image_url: { type: String, required: true },
    customer_code: { type: String, required: true },
  },
  {
    id: false,
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

@injectable()
class MeasureModel {
  public measureModel: Model<IMeasureSchema>;

  constructor() {
    connect('mongodb://127.0.0.1:27017/test')
    this.measureModel = model<IMeasureSchema>('Measure', Measure);
  }
}

export default MeasureModel;
export type IMeasure = HydratedDocument<IMeasureSchema>;