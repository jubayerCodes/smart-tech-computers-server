const mongoose = require("mongoose");
const BillingDetailModel = require("../models/BillingDetailModel");
const InvoiceProductModel = require("../models/InvoiceProductModel");
const PaymentModel = require("../models/PaymentModel");
const ObjectID = mongoose.Types.ObjectId;
const FormData = require("form-data");
const axios = require("axios");
// const nodemailer = require("../utility/EmailHelper");
const EmailSend = require("../utility/EmailHelper");
const ProductModel = require("../models/ProductModel");

const CreateInvoiceService = async (orderData) => {
    // Function to generate a unique order ID dynamically

    const date = new Date();
    let year = date.getFullYear();

    const generateOrderID = async () => {
        try {
            // Fetch the last order from InvoiceProductModel
            const latestOrder = await PaymentModel.findOne().sort({ createdAt: -1 });

            // Extract the last order number or start from 0
            const lastNumber = latestOrder ? parseInt(latestOrder?.orderID?.split("-")[2]) : 0;

            // Increment the order number and format it as 6-digit
            const orderNumber = (lastNumber + 1).toString().padStart(6, "0");

            return `#ABC-OD${year}-${orderNumber}`;
        } catch (error) {
            throw new Error("Failed to generate order ID: " + error.message);
        }
    };

    // Function to generate a unique order ID dynamically
    const generateInvoiceID = async () => {
        try {
            // Fetch the last order from InvoiceProductModel
            const latestOrder = await PaymentModel.findOne().sort({ createdAt: -1 });

            // Extract the last order number or start from 0
            const lastNumber = latestOrder ? parseInt(latestOrder?.invoiceID?.split("-")[2]) : 0;

            // Increment the order number and format it as 6-digit
            const orderNumber = (lastNumber + 1).toString().padStart(6, "0");

            return `#ABC-INV${year}-${orderNumber}`;
        } catch (error) {
            throw new Error("Failed to generate order ID: " + error.message);
        }
    };

    const { billingDetails, cartItems, paymentDetails } = orderData;


    for (const item of cartItems) {
        const product = await ProductModel.findById(item.productID);

        if (!product) {
            return { status: "failed", data: { error: "Product not found" } };
        }

        if (product.stock < item.qty) {
            return { status: "failed", data: { error: "Out of stock" } };
        }
    }


    try {
        // Step 1: Generate custom order ID
        const orderID = await generateOrderID();
        const invoiceID = await generateInvoiceID()

        console.log(invoiceID);

        // Step 2: Save billing details
        const newBilling = new BillingDetailModel(billingDetails);
        const savedBilling = await newBilling.save();

        // Step 3: Save ordered products with the generated order ID
        const invoiceProducts = cartItems.map((item) => ({
            productID: item.productID,
            billingDetailID: savedBilling._id,
            orderID, // Assign dynamically generated order ID
            invoiceID,
            qty: item.qty,
            color: item.color
        }));

        await InvoiceProductModel.insertMany(invoiceProducts);


        // Decrease product stock

        for (const item of cartItems) {
            await ProductModel.findByIdAndUpdate(
                item.productID,
                { $inc: { stock: -item.qty } }, // Decrement stock
                { new: true }
            );
        }

        // Step 4: Save payment details
        const newPayment = new PaymentModel({
            orderID,
            invoiceID,
            billingDetailID: savedBilling._id,
            subTotal: paymentDetails.subTotal,
            discount: paymentDetails.discount,
            grandTotal: paymentDetails.grandTotal,
            pay_method: paymentDetails.pay_method,
            tran_id: paymentDetails.tran_id,
            acc_number: paymentDetails.acc_number,
            payment_status: "pending"
        });

        const savedPayment = await newPayment.save();

        // Step 5: Send Email Confirmation
        const emailTo = billingDetails.cus_email;
        const emailSubject = `Order Placed - ${orderID}`;
        const emailHtml = `
            <p>Dear <b>${billingDetails.cus_name}</b>,</p>
            <p>Thank you for your order! Your Order ID is: <b>${orderID}</b></p>
            <h3>Order Details:</h3>
            <ul>
                <li>Subtotal: <b>$${paymentDetails.subTotal}</b></li>
                <li>Discount: <b>$${paymentDetails.discount}</b></li>
                <li>Grand Total: <b>$${paymentDetails.grandTotal}</b></li>
                <li>Payment Method: <b>${paymentDetails.pay_method}</b></li>
                <li>Payment Status: <b>Pending</b></li>
            </ul>
            <h3>Shipping Address:</h3>
            <p>${billingDetails.cus_address}, ${billingDetails.cus_city}</p>
            <h3>Contact Information:</h3>
            <p>Phone: ${billingDetails.cus_phone} <br>Email: ${billingDetails.cus_email}</p>
            <p>We will notify you once your order is confirmed.</p>
            <p>Best Regards, <br> <b>ABC Computers Pabna</b></p>
        `;

        await EmailSend(emailTo, emailHtml, emailSubject); // Send Email

        const newInvoiceProducts = await InvoiceProductModel.find({ orderID }).populate({
            path: "productID",
            populate: [
                { path: "subCategoryID" }
            ]
        })

        return { status: "success", orderID, billing: savedBilling, invoiceProducts: newInvoiceProducts, payment: savedPayment };
    } catch (error) {
        throw new Error("Order processing failed: " + error.message);
    }
};


const OrderListService = async () => {
    try {
        const data = await PaymentModel.aggregate([
            {
                $lookup: {
                    from: "invoiceproducts", // Collection name
                    localField: "orderID",
                    foreignField: "orderID",
                    as: "invoiceProducts",
                },
            },
            {
                $unwind: { path: "$invoiceProducts", preserveNullAndEmptyArrays: true }, // Flatten invoiceProducts
            },
            {
                $lookup: {
                    from: "billingdetails", // Collection name
                    localField: "billingDetailID",
                    foreignField: "_id",
                    as: "billingDetails",
                },
            },
            {
                $unwind: { path: "$billingDetails", preserveNullAndEmptyArrays: true }, // Flatten billing details
            },
            {
                $lookup: {
                    from: "products", // Collection name
                    localField: "invoiceProducts.productID",
                    foreignField: "_id",
                    as: "invoiceProducts.productDetails",
                },
            },
            {
                $unwind: { path: "$invoiceProducts.productDetails", preserveNullAndEmptyArrays: true }, // Flatten productDetails
            },
            {
                $group: {
                    _id: "$_id",
                    acc_number: { $first: "$acc_number" },
                    billingDetailID: { $first: "$billingDetailID" },
                    billingDetails: { $first: "$billingDetails" },
                    createdAt: { $first: "$createdAt" },
                    discount: { $first: "$discount" },
                    grandTotal: { $first: "$grandTotal" },
                    orderID: { $first: "$orderID" },
                    pay_method: { $first: "$pay_method" },
                    payment_status: { $first: "$payment_status" },
                    subTotal: { $first: "$subTotal" },
                    tran_id: { $first: "$tran_id" },
                    updatedAt: { $first: "$updatedAt" },
                    invoiceProducts: { $push: "$invoiceProducts" },
                },
            }
        ]).sort({ createdAt: -1 })
        return { status: "success", data: data }; // Ensure JSON response
    } catch (e) {
        return { status: "Fail", data: e.toString() }; // Ensure JSON error response
    }
}


const OrderDetailsService = async (id) => {

    try {
        const data = await PaymentModel.aggregate([
            {
                $match: { _id: new ObjectID(id) }
            },
            {
                $lookup: {
                    from: "invoiceproducts", // Collection name
                    localField: "orderID",
                    foreignField: "orderID",
                    as: "invoiceProducts",
                },
            },
            {
                $unwind: { path: "$invoiceProducts", preserveNullAndEmptyArrays: true }, // Flatten invoiceProducts
            },
            {
                $lookup: {
                    from: "billingdetails", // Collection name
                    localField: "billingDetailID",
                    foreignField: "_id",
                    as: "billingDetails",
                },
            },
            {
                $unwind: { path: "$billingDetails", preserveNullAndEmptyArrays: true }, // Flatten billing details
            },
            {
                $lookup: {
                    from: "products", // Collection name
                    localField: "invoiceProducts.productID",
                    foreignField: "_id",
                    as: "invoiceProducts.productDetails",
                },
            },
            {
                $unwind: { path: "$invoiceProducts.productDetails", preserveNullAndEmptyArrays: true }, // Flatten productDetails
            },
            {
                $group: {
                    _id: "$_id",
                    acc_number: { $first: "$acc_number" },
                    billingDetailID: { $first: "$billingDetailID" },
                    billingDetails: { $first: "$billingDetails" },
                    createdAt: { $first: "$createdAt" },
                    discount: { $first: "$discount" },
                    grandTotal: { $first: "$grandTotal" },
                    orderID: { $first: "$orderID" },
                    invoiceID: { $first: "$invoiceID" },
                    pay_method: { $first: "$pay_method" },
                    payment_status: { $first: "$payment_status" },
                    subTotal: { $first: "$subTotal" },
                    tran_id: { $first: "$tran_id" },
                    updatedAt: { $first: "$updatedAt" },
                    invoiceProducts: { $push: "$invoiceProducts" },
                },
            }
        ])
        return { status: "success", data: data }; // Ensure JSON response
    } catch (e) {
        return { status: "Fail", data: e.toString() }; // Ensure JSON error response
    }
}


const OrderStatusUpdateService = async (req) => {
    try {
        const id = req.params.id
        const status = req.body.status

        const existingPayment = await PaymentModel.findById(id).populate("billingDetailID")

        if (!existingPayment) {
            return { status: "fail", message: "Payment not found" };
        }

        existingPayment.payment_status = status

        await existingPayment.save()

        if(status === "confirmed"){

            const emailTo = existingPayment?.billingDetailID?.cus_email;
            const emailSubject = `Order Confirmation - ${existingPayment?.orderID}`;
            const emailHtml = `
                <p>Dear <b>${existingPayment?.billingDetailID?.cus_name}</b>,</p>
                <p>Your order is confirmed! Your Order ID is: <b>${existingPayment?.orderID}</b></p>
                <h3>Order Details:</h3>
                <ul>
                    <li>Subtotal: <b>$${existingPayment.subTotal}</b></li>
                    <li>Discount: <b>$${existingPayment.discount}</b></li>
                    <li>Grand Total: <b>$${existingPayment.grandTotal}</b></li>
                    <li>Payment Method: <b>${existingPayment.pay_method}</b></li>
                    <li>Payment Status: <b>${existingPayment?.payment_status}</b></li>
                </ul>
                <h3>Shipping Address:</h3>
                <p>${existingPayment?.billingDetailID?.cus_address}, ${existingPayment?.billingDetailID?.cus_city}</p>
                <h3>Contact Information:</h3>
                <p>Phone: ${existingPayment?.billingDetailID?.cus_phone} <br>Email: ${existingPayment?.billingDetailID?.cus_email}</p>
                <p>Best Regards, <br> <b>ABC Computers Pabna</b></p>
            `;

            await EmailSend(emailTo, emailHtml, emailSubject); // Send Email
        }

        return {
            status: "success",
            message: "Payment Status updated successfully",
            data: existingPayment,
        };
    } catch (error) {
        console.error("Error in OrderStatusUpdateService:", error.message);
        return {
            status: "fail",
            message: "Error updating payment status. Please try again.",
        };
    }
}


const OrderDeleteService = async (billingDetailID) => {
    try {
        // Step 1: Delete Payment
        const payment = await PaymentModel.findOne({ billingDetailID })
        if (!payment) {
            return { status: "fail", message: "Payment not found" };
        }

        await PaymentModel.deleteOne({ billingDetailID })


        // Step 2: Delete Invoice Products
        await InvoiceProductModel.deleteMany({ billingDetailID })

        // Step 3: Delete Billing Details
        await BillingDetailModel.findByIdAndDelete(billingDetailID)

        return { status: "success" }; // Ensure JSON response
    } catch (e) {
        return { status: "Fail", data: e.toString() }; // Ensure JSON error response
    }
}

module.exports = { CreateInvoiceService, OrderListService, OrderDeleteService, OrderStatusUpdateService, OrderDetailsService };