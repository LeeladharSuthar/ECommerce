import mongoose from "mongoose"
import validator from "validator"

interface IUser extends Document {
    _id: string;
    name: string;
    photo: string;
    email: string;
    role: "admin" | "user";
    gender: "male" | "female";
    dob: Date;
    createdAt: Date;
    updatedAt: Date;
    age: number;
}

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        name: {
            type: String,
            required: [true, "Please enter Name"]
        },
        photo: {
            type: String,
            required: [true, "Please enter Photo"]
        },
        role: {
            type: String,
            enum: ["admin", "user"],
            default: "user"
        },
        gender: {
            type: String,
            required: false,
            default: null
        },
        dob: {
            type: Date,
            required: false,
            default: null
        },
        email: {
            type: String,
            required: [true, "Please enter Email"],
            unique: [true, "Email adready registered"],
            validate: validator.default.isEmail,
        }
    }, {
    timestamps: true
}
)


userSchema.virtual("age").get(function () {
    const today = new Date();
    const dob = this.dob;
    let age
    if (dob) {
        age = today.getFullYear() - dob.getFullYear();
        if (today.getMonth() < dob.getMonth() || (today.getMonth() === dob.getMonth() && today.getDate() < dob.getDate())) {
            age--;
        }
    }
    return age;
})

export const User = mongoose.model<IUser>("User", userSchema)