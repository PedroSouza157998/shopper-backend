import { Model, UpdateWriteOpResult } from 'mongoose';
import { container } from 'tsyringe';


import MeasureModel, { IMeasure, IMeasureSchema } from '../schemas/Measure';
import { getMonthStartAndEnd } from '../utils/functions';

class MeasuresRepository {
    private ormRepository: Model<IMeasureSchema>;

    constructor() {
        this.ormRepository = container.resolve(MeasureModel).measureModel;
    }

    public async findById(id: string): Promise<IMeasure | undefined> {
        const measure = await this.ormRepository.findOne({measure_uuid: id});

        return measure || undefined;
    }

    public async findMonth({ datetime, type }: { datetime: Date, type: 'WATER' | 'GAS' }): Promise<IMeasure | undefined> {

        const measure = await this.ormRepository.findOne({ measure_datetime: getMonthStartAndEnd(new Date(datetime)), measure_type: type });

        return measure || undefined;
    }

    public async create(data: {
        image_url: string,
        measure_value: number,
        measure_uuid: string,
        measure_type: 'WATER' | 'GAS',
        measure_datetime: Date,
        customer_code: string
    }): Promise<IMeasure> {
        const measure = await this.ormRepository.create({
            image_url: data.image_url,
            has_confirmed: false,
            measure_datetime: data.measure_datetime,
            measure_type: data.measure_type,
            measure_uuid: data.measure_uuid,
            measure_value: data.measure_value
        })

        return measure;
    }

    public async update({
        measure_uuid,
        measure_value
    }: {
        measure_uuid: string,
        measure_value: number
    }): Promise<UpdateWriteOpResult> {

        return await this.ormRepository.updateOne({measure_uuid}, { $set: { measure_value, has_confirmed: true }})
        // return await measure.save();
    }
    public async delete(id: string): Promise<void> {
        await this.ormRepository.deleteOne({ _id: id });
    }
}

export default MeasuresRepository;