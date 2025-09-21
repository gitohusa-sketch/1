
import React, { useState } from 'react';
import { generateImagesService } from '../services/geminiService';
import { ASPECT_RATIOS } from '../constants';
import LoadingSpinner from './LoadingSpinner';

const ImageGenView: React.FC = () => {
  const [prompt, setPrompt] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [aspectRatio, setAspectRatio] = useState<string>('1:1');
  const [numberOfImages, setNumberOfImages] = useState<number>(1);

  const handleGenerate = async () => {
    if (!prompt.trim() || isLoading) return;

    setIsLoading(true);
    setError(null);
    setImages([]);

    try {
      const generatedImages = await generateImagesService({
        prompt,
        numberOfImages,
        aspectRatio,
      });
      setImages(generatedImages);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDownload = (imageUrl: string, index: number) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `gemini-image-${index + 1}.jpeg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="w-full max-w-5xl h-full flex flex-col items-center gap-6 p-4">
      <div className="w-full bg-gray-800 p-6 rounded-lg shadow-2xl border border-gray-700 flex flex-col gap-4">
        <h2 className="text-2xl font-bold text-center text-white">Image Generation Studio</h2>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Describe the image you want to create... e.g., 'A futuristic cityscape at sunset with flying cars'"
          className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 text-lg resize-none focus:outline-none focus:ring-2 focus:ring-blue-500 transition-shadow"
          rows={3}
          disabled={isLoading}
        />
        <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
                <label htmlFor="aspectRatio" className="block text-sm font-medium text-gray-400 mb-1">Aspect Ratio</label>
                <select id="aspectRatio" value={aspectRatio} onChange={(e) => setAspectRatio(e.target.value)} disabled={isLoading} className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {ASPECT_RATIOS.map(ratio => <option key={ratio} value={ratio}>{ratio}</option>)}
                </select>
            </div>
            <div className="flex-1">
                <label htmlFor="numberOfImages" className="block text-sm font-medium text-gray-400 mb-1">Number of Images</label>
                <select id="numberOfImages" value={numberOfImages} onChange={(e) => setNumberOfImages(Number(e.target.value))} disabled={isLoading} className="w-full bg-gray-700 text-gray-200 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500">
                    {[1, 2, 3, 4].map(num => <option key={num} value={num}>{num}</option>)}
                </select>
            </div>
        </div>
        <button
          onClick={handleGenerate}
          disabled={isLoading || !prompt.trim()}
          className="w-full bg-blue-600 text-white rounded-lg py-3 text-lg font-semibold disabled:bg-gray-600 disabled:cursor-not-allowed hover:bg-blue-700 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500"
        >
          {isLoading ? 'Generating...' : 'Generate Images'}
        </button>
      </div>

      <div className="w-full flex-grow flex items-center justify-center p-4">
        {isLoading && (
          <div className="text-center">
            <LoadingSpinner className="h-16 w-16 mx-auto" />
            <p className="mt-4 text-lg text-gray-400">Your vision is coming to life...</p>
          </div>
        )}
        {error && <p className="text-red-400 text-center">{error}</p>}
        {!isLoading && images.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full">
            {images.map((img, index) => (
              <div key={index} className="relative group bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700">
                <img src={img} alt={`Generated image ${index + 1}`} className="w-full h-auto object-contain" />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button onClick={() => handleDownload(img, index)} className="text-white bg-blue-600 hover:bg-blue-700 p-3 rounded-full">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                    </svg>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
        {!isLoading && images.length === 0 && !error && (
            <div className="text-center text-gray-500">
                <svg xmlns="http://www.w3.org/2000/svg" className="mx-auto h-24 w-24" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <p className="mt-4 text-xl">Your generated images will appear here.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default ImageGenView;
