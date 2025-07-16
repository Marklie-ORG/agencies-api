import { Database, Image, User } from "marklie-ts-core";
import { GCSWrapper } from "marklie-ts-core";

interface ImageWithUrl extends Image {
  imageUrl: string;
}

const database = await Database.getInstance();

export class ImagesService {

  async saveImage(fileData: any, user: User): Promise<string> {

    const buffer: Buffer = fileData._writeBuffer;
    const originalName = fileData?.originalFilename || "upload.jpg";

    const today = new Date().toISOString();
    
    const destination = `images/${user.activeOrganization!.uuid}---${today}---${originalName}`;
      
    const gcs = GCSWrapper.getInstance('marklie-client-reports');

    const imageGcsUrl = await gcs.uploadImage(
        fileData,
        buffer,
        destination
    );
    
    console.log(imageGcsUrl);
    
    const newImage = database.em.create(Image, {
        organization: user.activeOrganization!,
        imageName: originalName,
        gsUri: imageGcsUrl
    });

    await database.em.persistAndFlush(newImage);

    return await gcs.getSignedUrl(imageGcsUrl);
  }

  async getImages(user: User) {
    const images = await database.em.find(Image, { organization: user.activeOrganization! });

    const gcs = GCSWrapper.getInstance('marklie-client-reports');

    const imagesWithUrl: ImageWithUrl[] = [];

    for (const image of images) {
      const imageUrl = await gcs.getSignedUrl(image.gsUri);
      imagesWithUrl.push({ ...image, imageUrl });
    }
    

    return imagesWithUrl;
  }

  async deleteImage(uuid: string, user: User) {
    const image = await database.em.findOne(Image, { uuid, organization: user.activeOrganization! });
    if (!image) throw new Error("Image not found");

    const gcs = GCSWrapper.getInstance('marklie-client-reports');
    await gcs.deleteFile(image.gsUri.replace("gs://marklie-client-reports/", ""));

    await database.em.removeAndFlush(image);
  }
}
