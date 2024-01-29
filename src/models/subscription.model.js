import mongoose, { Schema } from "mongoose";

const subScriptionSchema = new Schema({
    subscriber: {
        type: Schema.Types.ObjectId, //one who is subscribing
        ref: "User" //subscriber is channel so same reference
    },
    channel: {
        type: Schema.Types.ObjectId, //one to whom 'subscriber' is subscribing
        ref: "User" //channel is subscriber so same reference
    }
}, {timestamps: true})


export const Subscription = mongoose.model("Subscription", subScriptionSchema)