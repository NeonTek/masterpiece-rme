import { Schema, model, models, Document } from "mongoose";

export interface IProduct extends Document {
  name: string;
  description: string;
  price: number;
  sku: string; // Stock Keeping Unit
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, "Product name is required."],
      trim: true,
    },
    description: {
      type: String,
      required: [true, "Product description is required."],
    },
    price: {
      type: Number,
      required: [true, "Product price is required."],
    },
    sku: {
      type: String,
      required: [true, "Product SKU is required."],
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const Product = models.Product || model<IProduct>("Product", ProductSchema);

export default Product;
