import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { Model } from "mongoose";
import { User } from "./schemas/user.schema";

import * as bcrypt from "bcryptjs";
import { JwtService } from "@nestjs/jwt";
import { SignUpDto } from "./dto/signup.dto";
import { LoginDto } from "./dto/login.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";

@Injectable()
export class AuthService {
  constructor(
    @InjectModel(User.name)
    private userModel: Model<User>,
    private jwtService: JwtService
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<{ message: string }> {
    try {
      const {
        firstName,
        lastName,
        email,
        phoneNumber,
        password,
        confirmPassword,
      } = signUpDto;
      if (password !== confirmPassword) {
        throw new BadRequestException("New passwords do not match");
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
    } catch (error) {
      {
        if (
          error.code === 11000 &&
          error.keyPattern &&
          error.keyPattern.email === 1
        ) {
          throw new HttpException(
            "User with this email address already exists",
            HttpStatus.BAD_REQUEST
          );
        }
        if (error.status === 400) {
          throw error;
        }
        throw new HttpException(
          "Something went wrong",
          HttpStatus.INTERNAL_SERVER_ERROR
        );
      }
    }
  }

  async login(loginDto: LoginDto): Promise<{ token: string }> {
    try {
      const { email, password } = loginDto;

      const user = await this.userModel.findOne({ email });

      if (!user) {
        throw new UnauthorizedException("User with this email does not exist.");
      }

      const isPasswordMatched = await bcrypt.compare(password, user.password);

      if (!isPasswordMatched) {
        throw new UnauthorizedException("Invalid password.");
      }

      const token = this.jwtService.sign({ id: user._id });

      return { token };
    } catch (error) {
      throw error;
    }
  }

  async updatePassword(
    user: { id: string; firstName: string; lastName: string; email: string },
    updatePasswordDto: UpdatePasswordDto
  ): Promise<{ message: string }> {
    try {
      const { email } = user;
      const userExist = await this.userModel.findOne({ email });
      if (!userExist) {
        throw new BadRequestException("User not found");
      }
      const isPasswordMatched = await bcrypt.compare(
        updatePasswordDto.currentPassword,
        userExist.password
      );
      if (!isPasswordMatched) {
        throw new BadRequestException("Current password is incorrect");
      }
      if (updatePasswordDto.newPassword !== updatePasswordDto.confirmPassword) {
        throw new BadRequestException("New passwords do not match");
      }

      const samePreviousPassword = await bcrypt.compare(
        updatePasswordDto.newPassword,
        userExist.password
      );
      if (samePreviousPassword == true) {
        throw new BadRequestException(
          "New Password cannot be same as Old Password."
        );
      }
      const hashedPassword = await bcrypt.hash(
        updatePasswordDto.newPassword,
        10
      );
      userExist.password = hashedPassword;
      await userExist.save();
      return { message: "Password updated successfully" };
    } catch (error) {
      throw error;
    }
  }

  async getPhoneNumber(email: string): Promise<{ phoneNumber: number }> {
    try {
      const user = await this.userModel.findOne({ email });
      return { phoneNumber: user.phoneNumber };
    } catch (error) {
      throw error;
    }
  }

  async deleteProfile(email: string): Promise<{ message: string }> {
    try {
      const user = await this.userModel.findOne({ email });
      if (!user) {
        throw new BadRequestException("User not found");
      }
      // Delete the user
      await user.remove();
      return { message: "User deleted successfully" };
    } catch (error) {
      throw error;
    }
  }
}
