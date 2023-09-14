import { AuthService } from "./auth.service";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";
export declare class AuthController {
    private authService;
    constructor(authService: AuthService);
    signUp(signUpDto: SignUpDto, res: any): Promise<{
        message: string;
    }>;
    login(loginDto: LoginDto, res: any): Promise<{
        token: string;
    }>;
    updatePassword(req: any, res: any, updatePasswordDto: UpdatePasswordDto): Promise<{
        message: string;
    }>;
    getAllUsers(req: any, res: any): Promise<{
        phoneNumber: number;
    }>;
    deleteProfile(req: any, res: any): Promise<{
        message: string;
    }>;
}
