interface FallbackModalProps {
  open: boolean;
  onClose: () => void;
  onDownload: () => void;
  imgUrl?: string | null;
}

export const FallbackModal = ({ open, onClose, onDownload, imgUrl }: FallbackModalProps) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-2xl p-6 max-w-xs w-full flex flex-col items-center relative">
        <button className="absolute top-2 right-4 text-gray-400 text-2xl" onClick={onClose}>&times;</button>
        {imgUrl && (
          <img src={imgUrl} alt="Screenshot preview" className="w-40 h-auto rounded-lg mb-4 border border-gray-200 shadow" />
        )}
        <button
          className="bg-shikho-yellow text-shikho-blue font-noto-bengali font-bold rounded-full px-6 py-2 text-lg mt-2"
          onClick={onDownload}
        >
          ডাউনলোড এবং শেয়ার!
        </button>
      </div>
    </div>
  );
}; 