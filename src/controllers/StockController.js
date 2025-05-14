const { AddStockService } = require("../services/StockServices");

exports.AddStock = async (req, res) => {
    try {
        const stockData = req.body; // Get data from frontend

        const response = await AddStockService(stockData);
        res.status(201).json({ success: true, data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};