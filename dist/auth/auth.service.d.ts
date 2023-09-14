import { Model } from "mongoose";
import { User } from "./schemas/user.schema";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";
export declare class AuthService {
    private userModel;
    private jwtService;
    constructor(userModel: Model<User>, jwtService: JwtService);
    signUp(signUpDto: SignUpDto): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto): Promise<{
        token: string;
    }>;
    updatePassword(user: {
        id: string;
        firstName: string;
        lastName: string;
        email: string;
    }, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    getPhoneNumber(email: string): Promise<{
        phoneNumber: number;
    }>;
    deleteProfile(email: string): Promise<{
        message: string;
    }>;
}
