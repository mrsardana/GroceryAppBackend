const mongoose = require('mongoose');

const fav = mongoose.model(
    "Fav",
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
                }
            }
        ]

    },
        {
            toJSON: {
                transform: function (model, ret) {
                    ret.favId = ret._id.toString();
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
    fav
};