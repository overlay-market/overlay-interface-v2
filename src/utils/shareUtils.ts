import { MARKETS_FULL_LOGOS, DEFAULT_LOGO } from "../constants/markets";

/**
 * Waits for all images in an element to finish loading
 */
const waitForImages = async (element: HTMLElement): Promise<void> => {
  const images = element.querySelectorAll('img');
  const imagePromises = Array.from(images).map(img => {
    if (img.complete) {
      return Promise.resolve();
    }
    return new Promise<void>((resolve) => {
      const onLoad = () => {
        img.removeEventListener('load', onLoad);
        img.removeEventListener('error', onLoad);
        resolve();
      };
      img.addEventListener('load', onLoad);
      img.addEventListener('error', onLoad);
    });
  });

  await Promise.all(imagePromises);
};

/**
 * Captures an HTML element as an image using html2canvas
 * Uses dynamic import to reduce initial bundle size
 */
export const captureShareCard = async (element: HTMLElement): Promise<string> => {
  try {
    // Wait for all images to load before capturing to avoid race conditions
    await waitForImages(element);

    // Lazy load html2canvas to reduce initial bundle size (~200KB)
    const html2canvas = (await import("html2canvas")).default;

    const canvas = await html2canvas(element, {
      backgroundColor: null,
      useCORS: true,
      allowTaint: true,
      scale: 2, // Higher resolution
      // Let html2canvas determine size from the element automatically
      onclone: (clonedDoc) => {
        // Ensure fonts are loaded in the cloned document
        const style = clonedDoc.createElement("style");
        style.textContent = `
          * {
            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", sans-serif !important;
          }
        `;
        clonedDoc.head.appendChild(style);
      },
    });

    return canvas.toDataURL("image/png", 1.0);
  } catch (error) {
    console.error("Error capturing share card:", error);
    throw new Error("Failed to capture image");
  }
};

/**
 * Downloads an image from a data URL
 */
export const downloadImage = (dataUrl: string, filename: string): void => {
  try {
    const link = document.createElement("a");
    link.download = filename;
    link.href = dataUrl;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
    throw new Error("Failed to download image");
  }
};

/**
 * Opens Twitter share dialog with text
 */
export const shareToTwitter = (text: string, imageUrl?: string): void => {
  try {
    const encodedText = encodeURIComponent(text);
    let url = `https://twitter.com/intent/tweet?text=${encodedText}`;

    if (imageUrl) {
      const encodedImageUrl = encodeURIComponent(imageUrl);
      url += `&url=${encodedImageUrl}`;
    }

    // Open in new window
    const width = 550;
    const height = 420;
    const left = (window.screen.width - width) / 2;
    const top = (window.screen.height - height) / 2;

    window.open(
      url,
      "twitter-share",
      `width=${width},height=${height},left=${left},top=${top},scrollbars=yes,resizable=yes`
    );
  } catch (error) {
    console.error("Error sharing to Twitter:", error);
    throw new Error("Failed to share to Twitter");
  }
};

/**
 * Gets the market image URL for a given market name
 */
export const getMarketImage = (marketName: string): string => {
  // URL encode the market name to match the MARKETS_FULL_LOGOS keys
  const encodedMarketName = encodeURIComponent(marketName);

  // Try to find the image in the MARKETS_FULL_LOGOS mapping
  const marketImage = MARKETS_FULL_LOGOS[encodedMarketName];

  if (marketImage) {
    return marketImage;
  }

  // Fallback: try without encoding for simple names
  const directMatch = MARKETS_FULL_LOGOS[marketName];
  if (directMatch) {
    return directMatch;
  }

  // Return default logo if no match found
  return DEFAULT_LOGO;
};

/**
 * Formats a timestamp into a readable duration string
 */
export const getDurationString = (createdTimestamp: string): string => {
  try {
    const createdDate = new Date(createdTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - createdDate.getTime();

    const diffSeconds = Math.floor(diffMs / 1000);
    const diffMinutes = Math.floor(diffSeconds / 60);
    const diffHours = Math.floor(diffMinutes / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) {
      const remainingHours = diffHours % 24;
      if (remainingHours > 0) {
        return `${diffDays}d ${remainingHours}h`;
      }
      return `${diffDays}d`;
    }

    if (diffHours > 0) {
      const remainingMinutes = diffMinutes % 60;
      if (remainingMinutes > 0) {
        return `${diffHours}h ${remainingMinutes}m`;
      }
      return `${diffHours}h`;
    }

    if (diffMinutes > 0) {
      return `${diffMinutes}m`;
    }

    return "< 1m";
  } catch (error) {
    console.error("Error calculating duration:", error);
    return "Unknown";
  }
};

/**
 * Utility function to format profit for social sharing
 */
export const formatProfitForSharing = (
  profitOVL: number,
  profitPercentage: number,
  marketName: string
): string => {
  const formattedProfit = profitOVL.toFixed(2);
  const formattedPercentage = profitPercentage.toFixed(1);

  return `Just made ${formattedProfit} OVL (${formattedPercentage}%) profit on ${marketName} 🚀\n\nTrade on overlay.market`;
};

/**
 * Detects if the user is on a mobile device
 */
export const isMobileDevice = (): boolean => {
  if (typeof window === 'undefined' || typeof navigator === 'undefined') {
    return false;
  }

  // Check for touch support and screen size
  const hasTouchScreen = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  const hasSmallScreen = window.innerWidth <= 768;

  // Check user agent for mobile devices
  const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
  const isMobileUA = mobileRegex.test(navigator.userAgent);

  return (hasTouchScreen && hasSmallScreen) || isMobileUA;
};

/**
 * Checks if sharing is supported by the browser
 */
export const isSharingSupported = (): boolean => {
  return typeof navigator !== "undefined" && "share" in navigator;
};

/**
 * Converts a data URL to a File object
 */
export const dataUrlToFile = async (dataUrl: string, filename: string): Promise<File> => {
  const response = await fetch(dataUrl);
  const blob = await response.blob();
  return new File([blob], filename, { type: 'image/png' });
};

/**
 * Copies an image to clipboard from data URL
 */
export const copyImageToClipboard = async (dataUrl: string): Promise<boolean> => {
  try {
    if (!navigator.clipboard || !window.ClipboardItem) {
      console.log('Clipboard API not supported');
      return false;
    }

    const response = await fetch(dataUrl);
    const blob = await response.blob();

    await navigator.clipboard.write([
      new ClipboardItem({
        [blob.type]: blob
      })
    ]);

    console.log('Image copied to clipboard successfully');
    return true;
  } catch (error) {
    console.error('Failed to copy image to clipboard:', error);
    return false;
  }
};

/**
 * Share to Twitter with image using Web Share API (if available)
 * Falls back to clipboard copy + Twitter intent on desktop
 * On mobile, uses native share menu without Twitter fallback
 */
export const shareToTwitterWithImage = async (
  text: string,
  imageDataUrl: string,
  filename: string = 'trade-result.png'
): Promise<{ method: 'web-share' | 'web-share-text' | 'clipboard' | 'text-only'; success: boolean }> => {
  const isMobile = isMobileDevice();

  console.log('shareToTwitterWithImage: Starting share flow', {
    isMobile,
    hasWebShare: !!navigator.share,
    hasCanShare: !!navigator.canShare
  });

  // Try Web Share API first (prioritized for mobile)
  if (navigator.share) {
    try {
      const imageFile = await dataUrlToFile(imageDataUrl, filename);

      const shareData = {
        title: 'Overlay Trade',
        text: text,
        files: [imageFile]
      };

      // Check if this data can be shared (if canShare is available)
      const canShare = navigator.canShare ? navigator.canShare(shareData) : true;

      console.log('shareToTwitterWithImage: Attempting Web Share API with image', {
        canShare,
        fileSize: imageFile.size,
        fileType: imageFile.type
      });

      if (canShare) {
        await navigator.share(shareData);
        console.log('shareToTwitterWithImage: Web Share API succeeded with image');
        return { method: 'web-share', success: true };
      } else {
        console.log('shareToTwitterWithImage: canShare returned false for data with files');
      }
    } catch (error) {
      console.log('shareToTwitterWithImage: Web Share API failed with image', {
        error: error instanceof Error ? error.message : String(error),
        errorName: error instanceof Error ? error.name : 'Unknown'
      });

      // On mobile, try Web Share API again without the image (text only)
      if (isMobile && navigator.share) {
        try {
          console.log('shareToTwitterWithImage: Attempting Web Share API with text only (mobile fallback)');
          await navigator.share({
            title: 'Overlay Trade',
            text: text,
          });
          console.log('shareToTwitterWithImage: Web Share API succeeded with text only');
          return { method: 'web-share-text', success: true };
        } catch (textShareError) {
          console.log('shareToTwitterWithImage: Web Share API failed even with text only', {
            error: textShareError instanceof Error ? textShareError.message : String(textShareError)
          });
          // User cancelled or error - don't fall back to Twitter on mobile
          return { method: 'web-share-text', success: false };
        }
      }
    }
  }

  // Desktop fallback: Copy to clipboard + open Twitter
  // Skip this on mobile to avoid opening Twitter directly
  if (!isMobile && navigator.clipboard && window.ClipboardItem) {
    console.log('shareToTwitterWithImage: Attempting clipboard + Twitter intent (desktop)');
    const clipboardSuccess = await copyImageToClipboard(imageDataUrl);
    if (clipboardSuccess) {
      // Open Twitter with text
      shareToTwitter(text);
      console.log('shareToTwitterWithImage: Clipboard succeeded, Twitter opened');
      return { method: 'clipboard', success: true };
    }
  }

  // Final fallback: Text-only Twitter intent (desktop only)
  if (!isMobile) {
    console.log('shareToTwitterWithImage: Final fallback - text-only Twitter (desktop)');
    shareToTwitter(text);
    return { method: 'text-only', success: true };
  }

  // On mobile, if we got here, everything failed - don't open Twitter
  console.log('shareToTwitterWithImage: All share methods failed on mobile');
  return { method: 'web-share-text', success: false };
};

/**
 * Uses native Web Share API if available, falls back to Twitter
 */
export const shareWithNativeAPI = async (
  text: string,
  title: string
): Promise<void> => {
  if (isSharingSupported()) {
    try {
      await navigator.share({
        title,
        text,
        url: "https://overlay.market",
      });
      return;
    } catch (error) {
      // User cancelled or error occurred, fall back to Twitter
      console.log("Native share cancelled or failed, falling back to Twitter");
    }
  }

  // Fallback to Twitter
  shareToTwitter(text);
};