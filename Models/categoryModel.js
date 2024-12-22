import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema(
    {
        name: {
            type: String,
            trim: true,
            required: true,
            maxlength: 32,
            unique: true,
        },
        slug: String,
    },
    { timestamps: true }
)

const Category = mongoose.models.Category || mongoose.model('Category', categorySchema);

export default Category;