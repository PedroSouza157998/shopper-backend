import { google } from "googleapis";
import { inject, injectable } from "tsyringe";
import { v4 as uuidv4 } from 'uuid';
import { GoogleAIFileManager } from "@google/generative-ai/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { saveBase64Image } from "../utils/functions";
import MeasuresRepository from "../repositories/measure.repository";
import { ServiceResponse } from "../utils/types";

interface IExecuteProps {
    image: string;
    measure_type: 'WATER' | 'GAS';
    customer_code: string;
    measure_datetime: Date;
}

@injectable()
export default class UploadImagesService {
    private textGenerate;
    private fileManager;
    private ormRepository;
    constructor() {
        this.ormRepository = new MeasuresRepository()
        const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY as string);

        this.textGenerate = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        this.fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY as string);

    }

    async execute({
        image,
        measure_type,
        customer_code,
        measure_datetime
    }: IExecuteProps): Promise<ServiceResponse> {
        const media = {
            mimeType: "image/png",
            displayName: "Uploaded Image"
        };

        const measure_uuid = uuidv4()
        if (!new Date(measure_datetime)) return {
            success: false,
            code: 400,
            data: {
                error_code: "INVALID_DATA",
                error_description: "valor inválido no parâmetro 'measure_datetime'"
            }
        }



        try {

            const filePath = saveBase64Image(image, measure_uuid)

            if (await this.ormRepository.findMonth({ datetime: measure_datetime, type: measure_type })) {
                return {
                    success: false,
                    code: 409,
                    data: {
                        error_code: "DOUBLE_REPORT",
                        error_description: "Leitura do mês já realizada"

                    }
                }
            }

            const fileResult = await this.fileManager.uploadFile(filePath, media)
            const textResult = await this.textGenerate.generateContent([
                {
                    fileData: {
                        mimeType: fileResult.file.mimeType,
                        fileUri: fileResult.file.uri
                    }
                }, {
                    text: "Me responda apenas com o valor apresentado neste medidor de água? Ex: '001000.' e '0101011665.' "
                }
            ])

            console.log(textResult.response.text())
            let measure_value = Number(textResult.response.text().split('.')[0])
            if (isNaN(measure_value)) measure_value = 0

            await this.ormRepository.create({
                customer_code,
                measure_type,
                image_url: fileResult.file.uri,
                measure_value,
                measure_datetime,
                measure_uuid
            })
            return {
                success: true,
                code: 200,
                data: {
                    image_url: fileResult.file.uri,
                    measure_value,
                    measure_uuid
                }
            }
        } catch (error) {
            throw new Error("Houve um problema imprevisto no upload de imagens!")
        }
        // let body = { file: { displayName: "Uploaded Image" } };


        // const bufferStream = new stream.PassThrough();
        // bufferStream.end(Buffer.from(image, "base64"));

        // // const createFileResponse = await genaiService.applySchema({
        // //     media: media,
        // //     auth: auth,
        // //     body,
        // // });
        // axios.post(``)

        // this.GENAI_DISCOVERY_URL
        // console.log({
        //     image,
        //     measure_type,
        //     customer_code
        // })
    }
}