const mongoose = require("mongoose");
const StockModel = require("../models/StockModel")
const ObjectID = mongoose.Types.ObjectId;
const ProductModel = require("../models/ProductModel");

const AddStockService = async(data) =>{
    try {
        const {productID, oldStock, newStock, stockDate} = data


        const existingProduct = await ProductModel.findById(productID)

        if(!existingProduct) {
            return { status: "fail", message: "Product not found!" };
        }

        const stock = new StockModel({productID, oldStock, newStock, stockDate})
        await stock.save()

    } catch (error) {
        console.error("Error in AddStockService:", error.message);
        return { status: "fail", message: "Error adding stock. Please try again." };
    }
}

module.exports = {AddStockService}