export async function shareImage(imageUrl: string, title?: string, text?: string) {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();

        if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'shared-image.png', { type: blob.type })] })) {
            const file = new File([blob], 'shared-image.png', { type: blob.type });
            await navigator.share({ files: [file], title, text });
            return true;
        } else {
            console.warn('Web Share API not supported');
            return false;
        }
    } catch (error) {
        console.error('Failed to share image:', error);
        return false;
    }
}
