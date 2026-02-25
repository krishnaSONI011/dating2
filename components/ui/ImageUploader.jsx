'use client'

import { useRef, useState } from "react"
import { FaTrash, FaPlus } from "react-icons/fa"

export default function ImageUploader({ images, setImages }) {

  const inputRef = useRef()
  const [previewIndex, setPreviewIndex] = useState(null)

  // select images
  const handleSelect = (e) => {
    const files = Array.from(e.target.files)

    const newImages = files.map(file => ({
      file,
      preview: URL.createObjectURL(file)
    }))

    setImages(prev => [...prev, ...newImages])
  }

  // remove image
  const removeImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index))
    // close preview if the removed image was open
    if (previewIndex === index) setPreviewIndex(null)
  }

  return (
    <div className="bg-gray-100 mt-8 rounded border border-gray-200 p-6">

      <h2 className="text-2xl font-bold mb-4">Upload Images</h2>

      {/* upload box */}
      <div
        onClick={() => inputRef.current.click()}
        className="border-2 border-dashed border-gray-300 rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer bg-white hover:bg-gray-50 transition"
      >
        <FaPlus className="text-2xl text-gray-400 mb-2"/>
        <p className="text-gray-500 font-medium">Click to upload images</p>
        <p className="text-xs text-gray-400">JPG, PNG allowed</p>
      </div>

      <input
        type="file"
        multiple
        accept="image/*"
        ref={inputRef}
        onChange={handleSelect}
        className="hidden"
      />

      {/* preview */}
      {images.length > 0 && (
        <div className="grid grid-cols-3 md:grid-cols-6 gap-4 mt-6">

          {images.map((img, index)=>(
            <div key={index} className="relative group">

              <img
                src={img.preview}
                className="w-full h-[200px] object-cover rounded-lg border cursor-pointer"
                onClick={() => setPreviewIndex(index)}
                alt={`preview-${index}`}
              />

              {/* remove btn */}
              <button
                onClick={()=> removeImage(index)}
                className="absolute top-1 right-1 bg-black/70 text-white p-1 rounded opacity-100 transition"
              >
                <FaTrash size={12}/>
              </button>

            </div>
          ))}

        </div>
      )}

      {/* Modal preview */}
      {previewIndex !== null && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50" onClick={() => setPreviewIndex(null)}>
          <div className="relative max-w-[90%] max-h-[90%]" onClick={(e)=>e.stopPropagation()}>
            <img src={images[previewIndex].preview} className="w-full h-auto max-h-[80vh] rounded" alt={`preview-large-${previewIndex}`} />

            <div className="flex gap-2 justify-end mt-2">
              <button onClick={()=>{ removeImage(previewIndex) }} className="bg-red-600 text-white px-4 py-2 rounded">Remove</button>
              <button onClick={()=>setPreviewIndex(null)} className="bg-gray-200 px-4 py-2 rounded">Close</button>
            </div>
          </div>
        </div>
      )}

    </div>
  )
}