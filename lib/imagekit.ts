import ImageKit from "@imagekit/nodejs";

// @imagekit/nodejs reads IMAGEKIT_PRIVATE_KEY from env automatically
// or pass it explicitly:
export const imagekit = new ImageKit({
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
});

export const IMAGEKIT_URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT!;
