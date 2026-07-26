import sharp from 'sharp';

async function processImage() {
  try {
    const metadata = await sharp('./public/splitlog-logo.jpg').metadata();
    const w = metadata.width;
    const h = metadata.height;
    
    const cropSize = Math.floor(w * 0.7); // crop size
    const xOffset = Math.floor((w - cropSize) / 2);
    const yOffset = Math.floor((h * 0.80 - cropSize) / 2);
    
    await sharp('./public/splitlog-logo.jpg')
      .extract({ left: xOffset, top: yOffset, width: cropSize, height: cropSize })
      .toFile('./public/favicon.png');
      
    console.log("Successfully created favicon.png");
  } catch (err) {
    console.error(err);
  }
}

processImage();
