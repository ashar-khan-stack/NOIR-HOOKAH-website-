import {
  ref,
  uploadBytes,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
  listAll,
  UploadMetadata,
} from 'firebase/storage';
import { storage } from './firebaseConfig';

export interface UploadProgressCallback {
  (progressPercent: number): void;
}

export const storageService = {
  /**
   * Upload an image file for hookahs, flavors, or gourmet menu
   * @param category 'hookahs' | 'flavors' | 'menu' | 'admin'
   * @param filename Unique name for the file
   * @param file Blob or File object
   * @param onProgress Optional progress callback
   */
  async uploadCatalogImage(
    category: 'hookahs' | 'flavors' | 'menu' | 'admin',
    filename: string,
    file: File | Blob,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    const cleanName = `${Date.now()}_${filename.replace(/[^a-zA-Z0-9._-]/g, '_')}`;
    const storageRef = ref(storage, `catalog/${category}/${cleanName}`);

    const metadata: UploadMetadata = {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        uploadedAt: new Date().toISOString(),
        category,
      },
    };

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    }

    const snapshot = await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(snapshot.ref);
  },

  /**
   * Upload user profile avatar or verification document
   */
  async uploadUserAvatar(
    userId: string,
    file: File | Blob,
    onProgress?: UploadProgressCallback
  ): Promise<string> {
    const cleanName = `avatar_${Date.now()}`;
    const storageRef = ref(storage, `users/${userId}/${cleanName}`);

    const metadata: UploadMetadata = {
      contentType: file.type || 'image/jpeg',
      customMetadata: {
        userId,
        uploadedAt: new Date().toISOString(),
      },
    };

    if (onProgress) {
      const uploadTask = uploadBytesResumable(storageRef, file, metadata);
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
            onProgress(Math.round(progress));
          },
          (error) => reject(error),
          async () => {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            resolve(downloadUrl);
          }
        );
      });
    }

    const snapshot = await uploadBytes(storageRef, file, metadata);
    return getDownloadURL(snapshot.ref);
  },

  /**
   * Delete a media asset by storage path
   */
  async deleteMedia(storagePath: string): Promise<void> {
    const fileRef = ref(storage, storagePath);
    await deleteObject(fileRef);
  },

  /**
   * List files in a category
   */
  async listCategoryMedia(category: 'hookahs' | 'flavors' | 'menu' | 'admin'): Promise<string[]> {
    const folderRef = ref(storage, `catalog/${category}`);
    const res = await listAll(folderRef);
    const urls = await Promise.all(res.items.map((item) => getDownloadURL(item)));
    return urls;
  },
};
