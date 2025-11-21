export async function downloadImage(imageUrl: string, filename = 'image.png') {
    try {
        const response = await fetch(imageUrl);
        const blob = await response.blob();
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = filename;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);

        return true;
    } catch (error) {
        console.error('Failed to download image:', error);
        return false;
    }
}
