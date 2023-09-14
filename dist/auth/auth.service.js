"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const user_schema_1 = require("./schemas/user.schema");
const bcrypt = require("bcryptjs");
const jwt_1 = require("@nestjs/jwt");
let AuthService = class AuthService {
    constructor(userModel, jwtService) {
        this.userModel = userModel;
        this.jwtService = jwtService;
    }
    async signUp(signUpDto) {
        try {
            const { firstName, lastName, email, phoneNumber, password, confirmPassword, } = signUpDto;
            if (password !== confirmPassword) {
                throw new common_1.BadRequestException("New passwords do not match");
            }
            const hashedPassword = await bcrypt.hash(password, 10);
            const user = await this.userModel.create({
                firstName,
                lastName,
                email,
                password: hashedPassword,
                phoneNumber,
            });
            const message = "User created successfully.";
            return { message };
        }
        catch (error) {
            {
                if (error.code === 11000 &&
                    error.keyPattern &&
                    error.keyPattern.email === 1) {
                    throw new common_1.HttpException("User with this email address already exists", common_1.HttpStatus.BAD_REQUEST);
                }
                if (error.status === 400) {
                    throw error;
                }
                throw new common_1.HttpException("Something went wrong", common_1.HttpStatus.INTERNAL_SERVER_ERROR);
            }
        }
    }
    async login(loginDto) {
        try {
            const { email, password } = loginDto;
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new common_1.UnauthorizedException("User with this email does not exist.");
            }
            const isPasswordMatched = await bcrypt.compare(password, user.password);
            if (!isPasswordMatched) {
                throw new common_1.UnauthorizedException("Invalid password.");
            }
            const token = this.jwtService.sign({ id: user._id });
            return { token };
        }
        catch (error) {
            throw error;
        }
    }
    async updatePassword(user, updatePasswordDto) {
        try {
            const { email } = user;
            const userExist = await this.userModel.findOne({ email });
            if (!userExist) {
                throw new common_1.BadRequestException("User not found");
            }
            const isPasswordMatched = await bcrypt.compare(updatePasswordDto.currentPassword, userExist.password);
            if (!isPasswordMatched) {
                throw new common_1.BadRequestException("Current password is incorrect");
            }
            if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
                throw new common_1.BadRequestException("New passwords do not match");
            }
            const samePreviousPassword = await bcrypt.compare(updatePasswordDto.newPassword, userExist.password);
            if (samePreviousPassword == true) {
                throw new common_1.BadRequestException("New Password cannot be same as Old Password.");
            }
            const hashedPassword = await bcrypt.hash(updatePasswordDto.newPassword, 10);
            userExist.password = hashedPassword;
            await userExist.save();
            return { message: "Password updated successfully" };
        }
        catch (error) {
            throw error;
        }
    }
    async getPhoneNumber(email) {
        try {
            const user = await this.userModel.findOne({ email });
            return { phoneNumber: user.phoneNumber };
        }
        catch (error) {
            throw error;
        }
    }
    async deleteProfile(email) {
        try {
            const user = await this.userModel.findOne({ email });
            if (!user) {
                throw new common_1.BadRequestException("User not found");
            }
            await user.remove();
            return { message: "User deleted successfully" };
        }
        catch (error) {
            throw error;
        }
    }
};
AuthService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(user_schema_1.User.name)),
    __metadata("design:paramtypes", [mongoose_2.Model,
        jwt_1.JwtService])
], AuthService);
exports.AuthService = AuthService;
//# sourceMappingURL=auth.service.js.map