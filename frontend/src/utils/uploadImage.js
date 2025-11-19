import { API_PATHS } from './apiPaths'
import axiosInstance from './axiosInstance';

const uploadImage = async (imageFile) => {
    const formData = new FormData();
    formData.append('image', imageFile);

    try {
        const response = await axiosInstance.post(API_PATHS.image.UPLOAD_IMAGE, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    } catch (error) {
        console.error('Error uploading the image', error);
        throw error;
    }
};

export default uploadImage;

//help in uploading the images as resume and help in download also
//Handles the client-side logic for uploading images to the backend.
//  It likely prepares the image data (e.g., with FormData),
//  sends the upload request to your backend API, and processes the response.