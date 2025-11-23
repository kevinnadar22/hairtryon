/**
 * Parse S3 XML error response and extract meaningful error information
 */
const parseS3Error = (xmlText: string): string => {
    try {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");

        const errorCode = xmlDoc.getElementsByTagName("Code")[0]?.textContent;
        const errorMessage = xmlDoc.getElementsByTagName("Message")[0]?.textContent;

        if (errorCode === "EntityTooLarge") {
            const proposedSize =
                xmlDoc.getElementsByTagName("ProposedSize")[0]?.textContent;
            const maxSizeAllowed =
                xmlDoc.getElementsByTagName("MaxSizeAllowed")[0]?.textContent;

            if (proposedSize && maxSizeAllowed) {
                const proposedMB = (parseInt(proposedSize) / (1024 * 1024)).toFixed(2);
                const maxMB = (parseInt(maxSizeAllowed) / (1024 * 1024)).toFixed(2);

                return `File size (${proposedMB} MB) exceeds the maximum allowed size of ${maxMB} MB`;
            }
        }

        // Return the error message if available, otherwise the error code
        return errorMessage || errorCode || "Unknown S3 error";
    } catch (e) {
        // If XML parsing fails, return the raw text
        return xmlText;
    }
};

const uploadToS3 = async (
    upload_url: string,
    fields: Record<string, string>,
    file_url: string,
    file: File
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
        const errorMessage = parseS3Error(text);
        throw new Error(`Photo upload failed: ${errorMessage}`);
    }

    return file_url;
};

export default uploadToS3;
