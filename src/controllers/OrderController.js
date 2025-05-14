const {
    CreateInvoiceService,
    OrderListService,
    OrderDeleteService,
    OrderStatusUpdateService,
    OrderDetailsService } = require("../services/OrderService");

exports.PlaceOrder = async (req, res) => {
    try {
        const orderData = req.body; // Get data from frontend

        const response = await CreateInvoiceService(orderData);
        res.status(201).json({ success: true, message: "Order placed successfully", data: response });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

exports.OrderList = async (req, res) => {
    try {
        let result = await OrderListService();
        return res.status(200).json(result); // Ensure JSON response
    } catch (e) {
        return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
    }
}

exports.OrderDetails = async (req, res) => {

    const id = req.params.id

    try {
        let result = await OrderDetailsService(id);
        return res.status(200).json(result); // Ensure JSON response
    } catch (e) {
        return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
    }
}

exports.OrderStatusUpdate = async (req, res) => {
    try {
        const result = await OrderStatusUpdateService(req)
        return res.status(200).json(result)
    } catch (error) {
        return res.status(500).json({ status: "Fail", data: error.toString() });
    }
}

exports.OrderDelete = async (req, res) => {
    const billingDetailID = req.params.id
    try {
        let result = await OrderDeleteService(billingDetailID);
        return res.status(200).json(result); // Ensure JSON response
    } catch (e) {
        return res.status(500).json({ status: "Fail", data: e.toString() }); // Ensure JSON error response
    }
}