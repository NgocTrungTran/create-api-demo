import axios from "axios";
import sha1 from "sha1";


class FileService {
    static upload(file) {
        const CLOUD_NAME = 'trantrung';
        const UPLOAD_API = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`;
        const formData = new FormData();
        formData.append("file", file);
        formData.append("upload_preset", "npebat90");
        return axios.post(UPLOAD_API, formData)
    }

    static destroy(filepath){
        let filename = filepath.split('/').pop().split('.')[0];
        const CLOUD_NAME = 'trantrung';
        const DESTROY_API = `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/destroy`;
        const timestamp = new Date().getTime();
        const public_id = filename;
        const api_key = "483742241757721";
        const api_secret_key = "kZkrnJ4jnqfyq3V-gEQoAouXBz0";
        const shaString = `public_id=${public_id}&timestamp=${timestamp}${api_secret_key}`;
        const signature = sha1(shaString)
        const formData = new FormData();
        formData.append("public_id", public_id);
        formData.append("signature", signature);
        formData.append("api_key",api_key);
        formData.append("timestamp", timestamp);
        return axios.post(DESTROY_API, formData);
    }
}

export default FileService;