export interface IRegisterEmail {
    email: string;
    token?: string;
    payload?: string;
}

export interface ICloudinaryUpload {
    folder: string;
    width: number;
    height: number;
    crop: string;
}
