// utils/mediaUploader.js
import axios from 'axios';

export async function uploadMedia(file) {
  try {
    const formData = new FormData();
    formData.append('file', file);

    const response = await axios.post('http://localhost:8080/media/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });

    return response.data;
  } catch (error) {
    console.error('Media upload failed:', error);
    return null;
  }
}
