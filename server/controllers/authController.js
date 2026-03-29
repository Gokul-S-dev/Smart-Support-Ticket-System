import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req,res) => {
    const { name, email , password , role } = req.body;

    const hashed = await bcrypt.hash(password, 10);
    const user = new User({
        name,
        email,
        password: hashed,
        role
    })
    await user.save();
    res.status(201).json({ msg: "User registered successfully" });
}

export const login = async (req,res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user){
        return res.status(400).json({
            msg: "User not found"
        })
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch){
        return res.status(400).json({
            msg: "Wrong password"
        });
    }

    const token = jwt.sign({ id:user._id},process.env.JWT_SECRET);

    res.json({token});

};