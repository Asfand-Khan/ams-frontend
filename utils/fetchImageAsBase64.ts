import { convertToBase64 } from "./convertToBase64";

export const fetchImageAsBase64 = async (
  imagePath: string
): Promise<string | undefined> => {
  try {
    const fullUrl = `${process.env.NEXT_PUBLIC_UPLOADS_BASE_URL}/${imagePath}`;
    const response = await fetch(fullUrl);
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${imagePath}`);
    }
    const blob = await response.blob();
    const file = new File([blob], imagePath, { type: blob.type });
    const base64 = await convertToBase64(file);
    return base64;
  } catch (error) {
    console.error("Error fetching and converting image:", error);
    return undefined;
  }
};
