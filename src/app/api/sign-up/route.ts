import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";


export async function POST(request: Request){
    await dbConnect();

    try{

        const {username, email, password} = await request.json();
        
        const existingUserVerifiedByUsername = await User.findOne({
            username,
            isVerified: true
        })

        if(existingUserVerifiedByUsername){
            return Response.json({
                success: false,
                message: "Username already exists"
            },{
                status: 400
            })
        }


        const existingUserVerifiedByEmail = await User.findOne({
            email
        });

        const verifyCode = Math.floor(100000 + Math.random() * 900000).toString();

        if(existingUserVerifiedByEmail){
            if(existingUserVerifiedByEmail.isVerified){
                return Response.json({
                    success: false,
                    message: "Email already exists"
                },{
                    status: 400
                })
            } else{
                const hashedPassword = await bcrypt.hash(password, 10);
                existingUserVerifiedByEmail.password = hashedPassword;
                existingUserVerifiedByEmail.verifyCode = verifyCode;
                existingUserVerifiedByEmail.verifyCodeExpiry = new Date(Date.now() + 3600000);
                await existingUserVerifiedByEmail.save();

            }
        }

        else{
            const hashedPassword = await bcrypt.hash(password, 10);
            const expiryDate = new Date();
            expiryDate.setHours(expiryDate.getHours() + 1); 

            const newUser = await User.create({
                username,
                email,
                password: hashedPassword,
                verifyCode,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
                isAcceptingMessages: true,
                messages: []
            });

            await newUser.save();
        }

        // Send verification email
        const emailResponse =  await sendVerificationEmail(
            email,
            username,
            verifyCode
        )

        if(!emailResponse.success){
            return Response.json({
                success: false,
                message: "Failed to send verification email"
            },{
                status: 500
            })
        }

        return Response.json({
                success: true,
                message: "user registered successfully, please verify your email",
            },{
                status: 201
            }
        )


    }catch(error){
        console.error("Error in registering user:", error);
        return Response.json({
            success: false,
            message: "Error in registering user",
        },{
            status: 500
        })
        
    }
}