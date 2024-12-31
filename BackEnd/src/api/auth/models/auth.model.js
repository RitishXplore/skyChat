import mongoose from 'mongoose';
import bcrypt from "bcryptjs";
import dotenv from 'dotenv';
dotenv.config();

const userSchema = new mongoose.Schema({
    username: {
        type: String,
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
            type: String,
            default : 'https://static.vecteezy.com/system/resources/previews/022/385/025/non_2x/a-cute-surprised-black-haired-anime-girl-under-the-blooming-sakura-ai-generated-photo.jpg'
        },
        imageName: {
            type: String,
            default : 'dummyprofile.jpg'
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
    timestamps: true,
    collection :'User'
});

userSchema.pre('save' ,async function(next){
    if(!this.isModified('password')){
        return next();
    }
    try {
        const hashedpassword = await bcrypt.hash(this.password , parseInt(process.env.SALT_ROUNDS) );
        console.log('Password hashed:', hashedpassword);
        this.password = hashedpassword;
         next();
    } catch (error) {
        console.error(error);
    }
})

userSchema.methods.comparePassword = async function(password){
    return bcrypt.compare(password , this.password);
}

const User = mongoose.model('User', userSchema);
export default User;
