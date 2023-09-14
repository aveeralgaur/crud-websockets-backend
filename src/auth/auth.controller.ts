import {
  Body,
  Controller,
  Res,
  Post,
  HttpStatus,
  Patch,
  UseGuards,
  Req,
  Get,
  Delete,
} from "@nestjs/common";
import { AuthService } from "./auth.service";
import { AuthGuard } from "@nestjs/passport";
import { LoginDto } from "./dto/login.dto";
import { SignUpDto } from "./dto/signup.dto";
import { UpdatePasswordDto } from "./dto/updatePassword.dto";

@Controller("auth")
export class AuthController {
  constructor(private authService: AuthService) {}

  //signing up a user
  @Post("/signup")
  async signUp(
    @Body() signUpDto: SignUpDto,
    @Res() res
  ): Promise<{ message: string }> {
    const signUpResponse = await this.authService.signUp(signUpDto);
    return res.status(HttpStatus.OK).json(signUpResponse);
  }

  //loging a user
  @Post("/login")
  async login(
    @Body() loginDto: LoginDto,
    @Res() res
  ): Promise<{ token: string }> {
    const loginResponse = await this.authService.login(loginDto);
    return res.status(HttpStatus.OK).json(loginResponse);
  }

  @Patch("/updatePassword")
  @UseGuards(AuthGuard())
  async updatePassword(
    @Req() req,
    @Res() res,
    @Body() updatePasswordDto: UpdatePasswordDto
  ): Promise<{ message: string }> {
    const updatePassword = await this.authService.updatePassword(
      req.user,
      updatePasswordDto
    );
    return res.status(HttpStatus.OK).json(updatePassword);
  }

  @Get("/getPhoneNumber")
  @UseGuards(AuthGuard())
  async getAllUsers(@Req() req, @Res() res): Promise<{ phoneNumber: number }> {
    const phoneNumber = await this.authService.getPhoneNumber(req.user.email);
    return res.status(HttpStatus.OK).json(phoneNumber);
  }

  @Delete("/deleteMyProfile")
  @UseGuards(AuthGuard())
  async deleteProfile(@Req() req, @Res() res): Promise<{ message: string }> {
    const deleteProfile = await this.authService.deleteProfile(req.user.email);
    return res.status(HttpStatus.OK).json(deleteProfile);
  }
}
