const mongoose = require("mongoose");

const order = mongoose.model(
    "Order",
    mongoose.Schema({
        userId: {
            type: String,
            required: true,
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                amount: {
                    type: Number,
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ],
        grandTotal: {
            type: Number,
            required: true
        },
        orderStatus: {
            type: String,
            required: true
        },
        transactionId: {
            type: String
        }

    },
        // {
        //     toJSON: {
        //         transform: function (model, ret) {
        //             ret.orderId = ret._id.toString();
        //             delete ret._id;
        //             delete ret.__v;
        //         }
        //     }
        // },
        {
            timestamps: true
        }

    )
);
module.exports = {
    order
}