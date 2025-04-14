import mongoose from 'mongoose';

const blogSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxlength: 100
    },
    content: {
        type: String,
        required: true
    },
    coverImage: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['draft', 'published'],
        default: 'draft'
    },   
    author: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
   
},{timestamps: true});

export const Blog = mongoose.model('Blog', blogSchema);