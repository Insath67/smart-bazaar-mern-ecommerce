const User = require("../models/User");
const bcrypt = require("bcryptjs");
const { sendMail } = require("../utils/Emails");
const { generateOTP } = require("../utils/GenerateOtp");
const Otp = require("../models/OTP");
const { sanitizeUser } = require("../utils/SanitizeUser");
const { generateToken } = require("../utils/GenerateToken");
const PasswordResetToken = require("../models/PasswordResetToken");

// Cookie maxAge must be a NUMBER in milliseconds
const COOKIE_EXPIRATION_DAYS = Number(process.env.COOKIE_EXPIRATION_DAYS) || 7;
const COOKIE_MAX_AGE = COOKIE_EXPIRATION_DAYS * 24 * 60 * 60 * 1000;

const cookieOptions = {
    sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
    maxAge: COOKIE_MAX_AGE,
    httpOnly: true,
    secure: process.env.PRODUCTION === "true" ? true : false
};

exports.signup = async (req, res) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });

        // if user already exists
        if (existingUser) {
            return res.status(400).json({ message: "User already exists" });
        }

        // hashing the password
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        req.body.password = hashedPassword;

        // creating new user
        const createdUser = new User(req.body);
        await createdUser.save();

        // getting secure user info
        const secureInfo = sanitizeUser(createdUser);

        // generating jwt token
        const token = generateToken(secureInfo);

        // sending jwt token in response cookies
        res.cookie("token", token, cookieOptions);

        return res.status(201).json(sanitizeUser(createdUser));

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occured during signup, please try again later"
        });
    }
};

exports.login = async (req, res) => {
    try {
        // checking if user exists or not
        const existingUser = await User.findOne({ email: req.body.email });

        // if exists and password matches the hash
        if (existingUser && (await bcrypt.compare(req.body.password, existingUser.password))) {

            // getting secure user info
            const secureInfo = sanitizeUser(existingUser);

            // generating jwt token
            const token = generateToken(secureInfo);

            // sending jwt token in response cookies
            res.cookie("token", token, cookieOptions);

            return res.status(200).json(sanitizeUser(existingUser));
        }

        res.clearCookie("token");
        return res.status(404).json({ message: "Invalid Credentials" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Some error occured while logging in, please try again later"
        });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        // checks if user id is existing in the user collection
        const isValidUserId = await User.findById(req.body.userId);

        // if user id does not exist
        if (!isValidUserId) {
            return res.status(404).json({
                message: "User not Found, for which the otp has been generated"
            });
        }

        // checks if otp exists by that user id
        const isOtpExisting = await Otp.findOne({ user: isValidUserId._id });

        // if otp does not exist
        if (!isOtpExisting) {
            return res.status(404).json({ message: "Otp not found" });
        }

        // checks if the otp is expired
        if (isOtpExisting.expiresAt < new Date()) {
            await Otp.findByIdAndDelete(isOtpExisting._id);
            return res.status(400).json({ message: "Otp has been expired" });
        }

        // checks if otp matches
        if (isOtpExisting && (await bcrypt.compare(req.body.otp, isOtpExisting.otp))) {
            await Otp.findByIdAndDelete(isOtpExisting._id);

            const verifiedUser = await User.findByIdAndUpdate(
                isValidUserId._id,
                { isVerified: true },
                { new: true }
            );

            return res.status(200).json(sanitizeUser(verifiedUser));
        }

        return res.status(400).json({ message: "Otp is invalid or expired" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Some Error occured" });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const existingUser = await User.findById(req.body.user);

        if (!existingUser) {
            return res.status(404).json({ message: "User not found" });
        }

        await Otp.deleteMany({ user: existingUser._id });

        const otp = generateOTP();
        const hashedOtp = await bcrypt.hash(otp, 10);

        const newOtp = new Otp({
            user: req.body.user,
            otp: hashedOtp,
            expiresAt: Date.now() + (parseInt(process.env.OTP_EXPIRATION_TIME) || 600000)
        });

        await newOtp.save();

        await sendMail(
            existingUser.email,
            "OTP Verification for Your MERN-AUTH-REDUX-TOOLKIT Account",
            `Your One-Time Password (OTP) for account verification is: <b>${otp}</b>.</br>Do not share this OTP with anyone for security reasons`
        );

        return res.status(201).json({ message: "OTP sent" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Some error occured while resending otp, please try again later"
        });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        // checks if user provided email exists or not
        const isExistingUser = await User.findOne({ email: req.body.email });

        // if email does not exist
        if (!isExistingUser) {
            return res.status(404).json({ message: "Provided email does not exists" });
        }

        await PasswordResetToken.deleteMany({ user: isExistingUser._id });

        // generates password reset token
        const passwordResetToken = generateToken(sanitizeUser(isExistingUser), true);

        // hashes the token
        const hashedToken = await bcrypt.hash(passwordResetToken, 10);

        // saves hashed token
        const newToken = new PasswordResetToken({
            user: isExistingUser._id,
            token: hashedToken,
            expiresAt: Date.now() + (parseInt(process.env.OTP_EXPIRATION_TIME) || 600000)
        });

        await newToken.save();

        // sends password reset link
        await sendMail(
            isExistingUser.email,
            "Password Reset Link for Your MERN-AUTH-REDUX-TOOLKIT Account",
            `<p>Dear ${isExistingUser.name},

            We received a request to reset the password for your MERN-AUTH-REDUX-TOOLKIT account. If you initiated this request, please use the following link to reset your password:</p>

            <p><a href="${process.env.ORIGIN}/reset-password/${isExistingUser._id}/${passwordResetToken}" target="_blank">Reset Password</a></p>

            <p>This link is valid for a limited time. If you did not request a password reset, please ignore this email. Your account security is important to us.

            Thank you,
            The MERN-AUTH-REDUX-TOOLKIT Team</p>`
        );

        return res.status(200).json({
            message: `Password Reset link sent to ${isExistingUser.email}`
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occured while sending password reset mail"
        });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        // checks if user exists or not
        const isExistingUser = await User.findById(req.body.userId);

        if (!isExistingUser) {
            return res.status(404).json({ message: "User does not exists" });
        }

        // fetches reset password token
        const isResetTokenExisting = await PasswordResetToken.findOne({
            user: isExistingUser._id
        });

        if (!isResetTokenExisting) {
            return res.status(404).json({ message: "Reset Link is Not Valid" });
        }

        // if token expired
        if (isResetTokenExisting.expiresAt < new Date()) {
            await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);
            return res.status(404).json({ message: "Reset Link has been expired" });
        }

        // if token exists and matches
        if (
            isResetTokenExisting &&
            isResetTokenExisting.expiresAt > new Date() &&
            (await bcrypt.compare(req.body.token, isResetTokenExisting.token))
        ) {
            await PasswordResetToken.findByIdAndDelete(isResetTokenExisting._id);

            await User.findByIdAndUpdate(isExistingUser._id, {
                password: await bcrypt.hash(req.body.password, 10)
            });

            return res.status(200).json({
                message: "Password Updated Successfuly"
            });
        }

        return res.status(404).json({ message: "Reset Link has been expired" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Error occured while resetting the password, please try again later"
        });
    }
};

exports.logout = async (req, res) => {
    try {
        res.clearCookie("token", {
            sameSite: process.env.PRODUCTION === "true" ? "None" : "Lax",
            httpOnly: true,
            secure: process.env.PRODUCTION === "true" ? true : false
        });

        return res.status(200).json({ message: "Logout successful" });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Logout failed" });
    }
};

exports.checkAuth = async (req, res) => {
    try {
        if (req.user) {
            const user = await User.findById(req.user._id);
            return res.status(200).json(sanitizeUser(user));
        }

        return res.sendStatus(401);

    } catch (error) {
        console.log(error);
        return res.sendStatus(500);
    }
};