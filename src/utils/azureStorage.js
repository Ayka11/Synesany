import { BlobServiceClient, BlockBlobClient } from '@azure/storage-blob';

const connectionString = process.env.AZURE_STORAGE_CONNECTION_STRING;
const containerName = process.env.AZURE_STORAGE_CONTAINER_NAME || 'synesthetica-uploads';

if (!connectionString) {
  console.warn('Azure Storage connection string not found');
}

const blobServiceClient = new BlobServiceClient(connectionString);
const containerClient = blobServiceClient.getContainerClient(containerName);

export class AzureStorageService {
  static async uploadFile(file, filename) {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      
      const options = {
        blobHTTPHeaders: {
          blobContentType: file.type || 'application/octet-stream'
        }
      };

      const result = await blockBlobClient.uploadData(file, options);
      
      return {
        success: true,
        url: blockBlobClient.url,
        filename: filename
      };
    } catch (error) {
      console.error('Azure upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async uploadBuffer(buffer, filename, contentType = 'application/octet-stream') {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      
      const options = {
        blobHTTPHeaders: {
          blobContentType: contentType
        }
      };

      const result = await blockBlobClient.uploadData(buffer, options);
      
      return {
        success: true,
        url: blockBlobClient.url,
        filename: filename
      };
    } catch (error) {
      console.error('Azure buffer upload error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async deleteFile(filename) {
    try {
      const blockBlobClient = containerClient.getBlockBlobClient(filename);
      await blockBlobClient.delete();
      
      return {
        success: true
      };
    } catch (error) {
      console.error('Azure delete error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static async listFiles() {
    try {
      const files = [];
      
      for await (const blob of containerClient.listBlobsFlat()) {
        files.push({
          name: blob.name,
          url: `${containerClient.url}/${blob.name}`,
          lastModified: blob.properties.lastModified,
          size: blob.properties.contentLength
        });
      }
      
      return {
        success: true,
        files
      };
    } catch (error) {
      console.error('Azure list error:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  static getFileUrl(filename) {
    const blockBlobClient = containerClient.getBlockBlobClient(filename);
    return blockBlobClient.url;
  }
}

// Initialize container if it doesn't exist
export const initializeContainer = async () => {
  try {
    await containerClient.createIfNotExists({ access: 'blob' });
    console.log('Azure container initialized:', containerName);
  } catch (error) {
    console.error('Container initialization error:', error);
  }
};
