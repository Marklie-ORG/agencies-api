import Router from "koa-router";
import type { Context } from "koa";
import { koaBody } from "koa-body";
import { ImagesService } from "lib/services/ImagesService.js";
import { Writable } from "stream";

export class ImagesController extends Router {
  private readonly imagesService: ImagesService;
  constructor() {
    super({ prefix: "/api/images" });
    this.imagesService = new ImagesService();
    this.setUpRoutes();
  } 

  private async setUpRoutes() {
    this.get("/", this.getImages.bind(this));
    this.delete("/:uuid", this.deleteImage.bind(this));
    this.post(
        "/upload",
        koaBody({
          multipart: true,
          formidable: {
            // Prevent writing to disk
            fileWriteStreamHandler: (file) => {
                const chunks: Buffer[] = [];
    
                return new Writable({
                  write(chunk, _, callback) {
                    chunks.push(chunk);
                    callback();
                  },
                  final(callback) {
                    (file as any)._writeBuffer = Buffer.concat(chunks);
                    callback();
                  },
                });
              },
            maxFileSize: 10 * 1024 * 1024, // Optional: 10MB max
          },
        }),
        this.uploadImage.bind(this)
      );
  }

  private async uploadImage(ctx: Context) {
    try {
        const files = ctx.request.files;
        const image = files?.image;
        const fileData = Array.isArray(image) ? image[0] : image as any;
        const user = ctx.state.user;

        const imageUrl = await this.imagesService.saveImage(fileData, user);

        ctx.body = { imageUrl };
        ctx.status = 200;
    } catch (error) {
      console.error(error);
      ctx.body = {
        message: "Internal server error",
      };
      ctx.status = 500;
    }
  }

  private async getImages(ctx: Context) {
    const user = ctx.state.user;
    const images = await this.imagesService.getImages(user);
    ctx.body = { images };
    ctx.status = 200;
  }

  private async deleteImage(ctx: Context) {
    const user = ctx.state.user;
    const uuid = ctx.params.uuid;
    await this.imagesService.deleteImage(uuid, user);
    ctx.body = { message: "Image deleted successfully" };
    ctx.status = 200;
  }

}


