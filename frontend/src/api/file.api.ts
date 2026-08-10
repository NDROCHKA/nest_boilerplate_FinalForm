import { client } from './client';

export interface UploadedFileResponse {
  url: string;
  filename: string;
  mimetype: string;
  size: number;
}

export const fileApi = {
  uploadSingle: async (file: File): Promise<UploadedFileResponse> => {
    const formData = new FormData();
    formData.append('file', file);
    return client.post<UploadedFileResponse>('/files/upload', formData);
  },

  uploadMultiple: async (files: File[]): Promise<UploadedFileResponse[]> => {
    const formData = new FormData();
    files.forEach((file) => formData.append('files', file));
    return client.post<UploadedFileResponse[]>('/files/upload-multiple', formData);
  },
};
