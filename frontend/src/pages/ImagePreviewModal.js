import React, { useEffect, useRef, useState } from 'react';
import '../styles/HobbySpaceDetailPage.css';

export default function ImagePreviewModal({ url, onClose }) {
  const imgRef = useRef();
  const [dimensions, setDimensions] = useState(null);

  useEffect(() => {
    if (imgRef.current) {
      const { naturalWidth, naturalHeight } = imgRef.current;
      setDimensions({ width: naturalWidth, height: naturalHeight });
    }
  }, [url]);

  return (
    <div className="image-preview-modal" onClick={onClose}>
      <img
        ref={imgRef}
        src={url}
        alt="Preview"
        className="image-preview-modal-img"
        onClick={e => e.stopPropagation()}
        onLoad={e => {
          setDimensions({ width: e.target.naturalWidth, height: e.target.naturalHeight });
        }}
      />
      <button
        className="image-preview-modal-close"
        onClick={e => { e.stopPropagation(); onClose(); }}
        aria-label="Close preview"
      >×</button>
    </div>
  );
}