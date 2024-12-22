import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
    {
        action: String,
        details: String,
        performedAt: {
            type: Date,
            default: Date.now(),
        }
    }, { timestamps: true },
);

const Log = mongoose.models.Log || mongoose.model('Log', logSchema);

export default Log;