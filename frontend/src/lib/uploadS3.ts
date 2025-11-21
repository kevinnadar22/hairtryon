
const uploadToS3 = async (
    upload_url: string,
    fields: Record<string, string>,
    file_url: string,
    file: File,
): Promise<string> => {
    const formData = new FormData();

    // Required: all fields from the backend policy
    Object.entries(fields).forEach(([key, value]) => {
        formData.append(key, value);
    });

    // The file field MUST be named "file" for S3 POST
    formData.append("file", file);

    const res = await fetch(upload_url, {
        method: "POST",
        body: formData,
    });

    if (!res.ok) {
        const text = await res.text();
        throw new Error(`S3 upload failed: ${res.status} ${text}`);
    }

    return file_url;
};

export default uploadToS3;
