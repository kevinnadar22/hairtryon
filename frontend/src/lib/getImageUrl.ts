const getUploadedAsUrl = (userUploadedImage: string | File | null) => {
    if (typeof userUploadedImage === 'string') {
        return userUploadedImage;
    } else if (userUploadedImage instanceof File) {
        return URL.createObjectURL(userUploadedImage);
    }
    return '';
}

export default getUploadedAsUrl;