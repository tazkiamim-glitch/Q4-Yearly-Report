import { useState } from 'react';
import html2canvas from 'html2canvas';

interface UseShareOptions {
  shareTitle?: string;
  shareText?: string;
  fileName?: string;
}

export function useShare({ shareTitle = 'Shikho Quarter in Review', shareText = 'Check out my learning summary!', fileName = 'shikho-quarter-in-review.png' }: UseShareOptions) {
  const [hideUI, setHideUI] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [imgUrl, setImgUrl] = useState<string | null>(null);

  const handleShare = async () => {
    setHideUI(true);
    setTimeout(async () => {
      // 1. Update --real-vh to match the current viewport height
      document.documentElement.style.setProperty('--real-vh', `${window.innerHeight}px`);
      // 2. Wait for fonts to load
      if (document.fonts && document.fonts.ready) {
        await document.fonts.ready;
      }
      // 3. Capture the main slide container if present, else fallback to body
      const mainContainer = document.querySelector('.slide-container');
      const target = mainContainer || document.body;
      if (target) {
        const canvas = await html2canvas(target as HTMLElement, { background: undefined, useCORS: true });
        const dataUrl = canvas.toDataURL('image/png');
        setImgUrl(dataUrl);
        const blob = await (await fetch(dataUrl)).blob();
        const filesArray = [
          new File([blob], fileName, { type: 'image/png' })
        ];
        // Try Web Share API
        if (navigator.canShare && navigator.canShare({ files: filesArray })) {
          try {
            await navigator.share({
              files: filesArray,
              title: shareTitle,
              text: shareText
            });
            setHideUI(false);
            return;
          } catch {
            // User cancelled or error
          }
        }
        // Fallback: show modal
        setModalOpen(true);
        setHideUI(false);
      }
    }, 100);
  };

  const handleDownload = () => {
    if (imgUrl) {
      const link = document.createElement('a');
      link.href = imgUrl;
      link.download = fileName;
      link.click();
      setModalOpen(false);
    }
  };

  return {
    handleShare,
    modalOpen,
    setModalOpen,
    imgUrl,
    handleDownload,
    hideUI,
    setHideUI,
  };
} 