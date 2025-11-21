export async function copyImageToClipboard(imageUrl: string) {
    try {
        // Fetch the image with proper CORS headers
        const response = await fetch(imageUrl, {
            mode: 'cors',
            credentials: 'omit'
        });

        if (!response.ok) {
            throw new Error(`Failed to fetch image: ${response.status}`);
        }

        const blob = await response.blob();

        // Convert to PNG if not already
        const imageBlob = await convertToPNG(blob);

        await navigator.clipboard.write([
            new ClipboardItem({ 'image/png': imageBlob })
        ]);
        return true;
    } catch (error) {
        console.error('Failed to copy image:', error);
        return false;
    }
}

async function convertToPNG(blob: Blob): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        if (!ctx) {
            reject(new Error('Failed to get canvas context'));
            return;
        }

        img.onload = () => {
            canvas.width = img.width;
            canvas.height = img.height;
            ctx.drawImage(img, 0, 0);

            canvas.toBlob((pngBlob) => {
                if (pngBlob) {
                    resolve(pngBlob);
                } else {
                    reject(new Error('Failed to convert image to PNG'));
                }
            }, 'image/png');
        };

        img.onerror = () => {
            reject(new Error('Failed to load image'));
        };

        img.src = URL.createObjectURL(blob);
    });
}
