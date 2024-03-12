import { boxed, Box } from "@syncedstore/core";
export type imageData = Box<{
    width: number;
    height: number;
    data: number[];
    colorSpace: PredefinedColorSpace;
}>

export function getImage(ctx: CanvasRenderingContext2D): imageData {
    const imgData = ctx.getImageData(0, 0, ctx.canvas.width, ctx.canvas.height);

    return boxed({
      width: imgData.width,
      height: imgData.height,
      data: Array.from(imgData.data),
      colorSpace: imgData.colorSpace
    });
  }
  
export function putImage(img: imageData, ctx: CanvasRenderingContext2D) {
    const { width, height, data, colorSpace } = img.value;
    const imgData = new ImageData(new Uint8ClampedArray(data), width, height, {colorSpace});
    ctx.putImageData(imgData, 0, 0);
}