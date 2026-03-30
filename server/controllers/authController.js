import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";


export const register = async (req,res) => {
    try {
        const { name, email , password } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ msg: "User already exists" });
        }

        const hashed = await bcrypt.hash(password, 10);
        const user = new User({
            name,
            email,
            password: hashed,
            role: "user"
        })
        await user.save();
        res.status(201).json({ msg: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ message: "Registration failed" });
    }
}

export const login = async (req,res) => {
    try {
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

        const token = jwt.sign({ id:user._id, role: user.role},process.env.JWT_SECRET);

        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (err) {
        res.status(500).json({ message: "Login failed" });
    }

};

export const getCurrentUser = async (req, res) => {
    res.json({ user: req.user });
};