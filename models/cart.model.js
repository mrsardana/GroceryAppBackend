const mongoose = require('mongoose');

const cart = mongoose.model(
    "Cart",
    mongoose.Schema({
        userId: {
            type: String,
            required: true
        },
        products: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: 'Product',
                    required: true
                },
                qty: {
                    type: Number,
                    required: true
                }
            }
        ]

    },
        {
            toJSON: {
                transform: function (model, ret) {
                    ret.cartId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                }
            }
        },
        {
            timestamps: true
        }
    )
);

module.exports = {
    cart
};