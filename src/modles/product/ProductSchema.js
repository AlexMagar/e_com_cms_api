import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
    {
        status: {
            type: String,
            default: "inactive",
        },
        name: {
            type: String,
            required: true,
        },
        parentCat: {
            type: mongoose.Types.ObjectId,
            required: true,
            ref: "Product"
        },
        slug: {
            type: String,
            unique: true,
            index: 1,
            required: true,
        },
        price: {
            type: Number,
            required: true,
        },
        qty: {
            type: Number,
            required: true,
        },
        salesEndDate: {
            type: Date,
            default: null
        },
        salesPrice: {
            type: Number,
        },
        salesStartDate: {
            type: Date,
            default: null
        },
        sku: {
            type: String,
            unique: true,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    }
)

export default mongoose.model("Product", productSchema) // this will create a table name products