import { apiClient } from "./api-client";

/**
 * Upload một file ảnh lên Cloudinary thông qua backend endpoint.
 * @param file File ảnh cần upload
 * @returns URL ảnh sau khi upload thành công (secure_url từ Cloudinary)
 */
export async function uploadImageToCloudinary(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const response = await apiClient.post<{ data: string; code: number; message?: string }>(
    "/api/v1/admin/upload/image",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );

  const url = response.data?.data;
  if (!url) {
    throw new Error("Upload thất bại: Server không trả về URL ảnh");
  }
  return url;
}
