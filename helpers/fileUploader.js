import axios from 'axios';

/**
 * Uploads a media file to the backend server.
 * @param {File} file - The file to upload.
 * @returns {Promise<Object|null>} The uploaded media data or null if upload failed.
 */
export async function uploadMedia(file) {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post("http://localhost:8080/media/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Media upload failed:", error);
    return null;
  }
}
