const MAX_SOURCE_BYTES = 20 * 1024 * 1024;
const MAX_OUTPUT_BYTES = 1 * 1024 * 1024;
const MAX_DIMENSION = 1600;

export function prepareImage(source: Blob): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(source.type)) {
    return Promise.reject(new Error('Choose a JPEG, PNG, or WebP image.'));
  }
  if (source.size > MAX_SOURCE_BYTES) {
    return Promise.reject(new Error('Choose an image smaller than 20 MB.'));
  }

  const objectUrl = URL.createObjectURL(source);
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => {
      URL.revokeObjectURL(objectUrl);
      if (image.naturalWidth > 20000 || image.naturalHeight > 20000) {
        reject(new Error('The image dimensions are too large.'));
        return;
      }

      let scale = Math.min(1, MAX_DIMENSION / Math.max(image.naturalWidth, image.naturalHeight));
      const canvas = document.createElement('canvas');
      const context = canvas.getContext('2d');
      if (!context) {
        reject(new Error('This browser could not process the image.'));
        return;
      }

      let dataUrl = '';
      let outputSize = 0;
      while (scale >= 0.4) {
        canvas.width = Math.round(image.naturalWidth * scale);
        canvas.height = Math.round(image.naturalHeight * scale);
        context.drawImage(image, 0, 0, canvas.width, canvas.height);
        dataUrl = canvas.toDataURL('image/jpeg', 0.82);
        outputSize = Math.ceil((dataUrl.length - dataUrl.indexOf(',') - 1) * 0.75);
        if (outputSize <= MAX_OUTPUT_BYTES) break;
        scale *= 0.8;
      }

      if (outputSize > MAX_OUTPUT_BYTES) {
        reject(new Error('Could not reduce this image to the 1 MB upload limit.'));
        return;
      }
      resolve(dataUrl);
    };
    image.onerror = () => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error('The selected file could not be read as an image.'));
    };
    image.src = objectUrl;
  });
}
