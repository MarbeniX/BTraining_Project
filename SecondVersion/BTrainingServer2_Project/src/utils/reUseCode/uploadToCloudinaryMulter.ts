import { ICloudinaryUpload } from "../../types";
import cloudinary from "../../config/cloudinary";

export const uploadCloudinaryMulter = async (
    file: Express.Multer.File,
    upload: ICloudinaryUpload
) => {
    try {
        const b64 = file.buffer.toString("base64");
        const dataURI = `data:${file.mimetype};base64,${b64}`;
        const result = await cloudinary.uploader.upload(dataURI, {
            folder: upload.folder,
            width: upload.width,
            height: upload.height,
            crop: upload.crop,
        });
        return result;
    } catch (err) {
        throw err;
    }
};
