import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
    userName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String
    },
    isEmailVerified: {
        type: Boolean,
        default: false
    },
    isPhoneVerified: {
        type: Boolean,
        default: false
    },
    verificationToken: {
        type: String
    },
    otp: {
        type: Number,
        validate: {
            validator: function(v) {
                return /^[0-9]{6}$/.test(v);
            },
            message: props => `${props.value} is not a valid 6-digit OTP!`
        }
    },
    authProviders: {
        google: String,
        github: String,
        facebook: String
    },
    profilePicture: {
        url: {
            type: String
        },
        imageName: {
            type: String
        }
    },
    status: {
        type: String,
        default: 'active'
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    callHistory: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Call'
    }],
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat'
    }],
    groups: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Group'
    }],
    isActive: {
        type: Boolean,
        default: true
    },
    typingTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    lastActive: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

const User = mongoose.model('User', userSchema);
export default User;
