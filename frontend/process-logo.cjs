const Jimp = require('jimp');

async function processImage() {
  try {
    const image = await Jimp.read('./public/splitlog-logo.jpg');
    
    // The image is a square (e.g. 1024x1024)
    // The coin is in the center-top. Let's crop the center.
    // Assuming the coin takes up the top 75% of the image.
    const w = image.bitmap.width;
    const h = image.bitmap.height;
    
    const cropSize = Math.floor(w * 0.7); // crop size
    const xOffset = Math.floor((w - cropSize) / 2);
    const yOffset = Math.floor((h * 0.75 - cropSize) / 2); // roughly centering on top 75%
    
    await image.crop(xOffset, yOffset, cropSize, cropSize)
               .writeAsync('./public/favicon.png');
    
    console.log("Successfully created favicon.png");
  } catch (err) {
    console.error(err);
  }
}

processImage();
