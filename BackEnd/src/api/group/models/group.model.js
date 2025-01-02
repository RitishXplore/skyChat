import mongoose from 'mongoose';

// **Group Schema**
const groupSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    icon: {
        type: String
    },
    members: [{
        userId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        role: {
            type: String,
            enum: ['admin', 'member'],
            default: 'member'
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    status: {
        type: String
    },
    isAdminOnly: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    collection: 'Group'
});

const Group = mongoose.model('Group', groupSchema);

export {Group};

