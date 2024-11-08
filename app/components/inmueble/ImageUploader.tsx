// app/components/ImageUploader.tsx
import React from "react";
import ImageUploading, { ImageListType } from "react-images-uploading";

interface ImageUploaderProps {
  onImageChange: (images: string[]) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onImageChange }) => {
  const [images, setImages] = React.useState<ImageListType>([]);
  const maxNumber = 6;

  const onChange = (imageList: ImageListType) => {
    setImages(imageList);
    onImageChange(imageList.map((image) => image.data_url!));
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h2 className="text-xl font-semibold mb-4 text-center">Subir Imágenes</h2>
      <ImageUploading
        multiple
        value={images}
        onChange={onChange}
        maxNumber={maxNumber}
        dataURLKey="data_url"
      >
        {({ imageList, onImageUpload, onImageRemove, isDragging, dragProps }) => (
          <div className="upload__image-wrapper">
            <button
              className={`p-2 mb-4 border rounded-md w-full ${isDragging ? "bg-red-300" : "bg-blue-500"} text-white`}
              onClick={onImageUpload}
              {...dragProps}
            >
              {isDragging ? "Suelte las imágenes aquí" : "Haga clic o arrastre las imágenes aquí"}
            </button>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {imageList.map((image, index) => (
                <div key={index} className="relative group">
                  <img src={image["data_url"]} alt="" className="w-full h-32 object-cover rounded-md" />
                  <button
                    onClick={() => onImageRemove(index)}
                    className="absolute top-1 right-1 p-1 bg-red-500 bg-opacity-60 text-white rounded-full hover:bg-opacity-80 transition-opacity"
                  >
                    &times;
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </ImageUploading>
    </div>
  );
};

export default ImageUploader;
