const mongoose = require('mongoose');

const user = mongoose.model(
    "User",
    mongoose.Schema({
        fullName: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true,
            unique: true
        },
        password: {
            type: String,
            required: true
        },
        address: {
            type: String,
            required: true
        },
        phone: {
            type: String,
            required: true
        },
        stripeCustomerID: {
            type: String,
        }
    },
        {
            toJSON: {
                transform: function (doc, ret) {
                    ret.userId = ret._id.toString();
                    delete ret._id;
                    delete ret.__v;
                    delete ret.password;
                }
            }
        },
        {
            timestamps: true
        })
);

module.exports = {
    user
}