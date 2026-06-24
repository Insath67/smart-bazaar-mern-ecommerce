require("dotenv").config();
const mongoose = require("mongoose");
const Product = require("./models/Product");

const productImages = [
  "https://placehold.co/800x800/f8fafc/111827?text=iPhone+9",
  "https://placehold.co/800x800/fef3c7/111827?text=Premium+Perfume",
  "https://placehold.co/800x800/e0f2fe/111827?text=Samsung+Phone",
  "https://placehold.co/800x800/fce7f3/111827?text=OPPO+Phone",
  "https://placehold.co/800x800/ecfdf5/111827?text=Smart+Watch",
  "https://placehold.co/800x800/f3e8ff/111827?text=Headphones",
  "https://placehold.co/800x800/fee2e2/111827?text=Fashion+Shoes",
  "https://placehold.co/800x800/e5e7eb/111827?text=Luxury+Bag",
  "https://placehold.co/800x800/dbeafe/111827?text=Gaming+Laptop",
  "https://placehold.co/800x800/fef9c3/111827?text=Smart+Store"
];

async function updateImages() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Connected to DB");

    const products = await Product.find();

    console.log("Products found:", products.length);

    for (let i = 0; i < products.length; i++) {
      const imageUrl = productImages[i % productImages.length];

      await Product.findByIdAndUpdate(products[i]._id, {
        thumbnail: imageUrl,
        images: [imageUrl]
      });
    }

    console.log(`Updated ${products.length} product images successfully`);
    process.exit(0);
  } catch (error) {
    console.log("Error updating product images:", error);
    process.exit(1);
  }
}

updateImages();