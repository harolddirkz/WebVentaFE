import { useState } from "react";
import axios from "axios";

const ImgBBUploader = ({ onSelectImage }) => {
  const [imageUrl, setImageUrl] = useState("");

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await axios.post(
        "https://api.imgbb.com/1/upload?key=4388c7d43ba3d77a601dd5aa45ae1576", 
        formData
      );

      const url = response.data.data.url;
      setImageUrl(url);
      onSelectImage(url);
    } catch (error) {
      console.error("Error al subir imagen:", error);
    }
  };

  return (
    <div>
      <input type="file" onChange={handleImageUpload} />
      {imageUrl && <img src={imageUrl} alt="Imagen subida" width={100} />}
    </div>
  );
};

export default ImgBBUploader;
