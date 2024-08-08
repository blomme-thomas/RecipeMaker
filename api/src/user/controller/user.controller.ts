import { Body, Controller, Delete, Get, Param, Post, Put, Query, UploadedFile, UseGuards, UseInterceptors, Request, Res, ValidationPipe } from '@nestjs/common';
import { UserService } from '../service/user.service';
import { User, UserRole } from '../model/user.interface';
import { catchError, map, Observable, of, switchMap, tap } from 'rxjs';
import { JwtAuthGuard } from 'src/auth/guards/jwt-guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { hasRoles } from 'src/auth/decorator/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer'
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { join } from 'path';
import { UserIsUserGuard } from 'src/auth/guards/user-is-user.guard';
import { UpdateResult } from 'typeorm';
import { CreateUserDto } from '../dto/create-user.dto';
import { LoginUserDto } from '../dto/login-user.dto';
import { UpdateUserDto } from '../dto/update-user.dto';

export const storage = {
    storage: diskStorage({
        destination: './upload/profileImages',
        filename: (req, file, cb) => {
            const filename: string = uuidv4();
            const extension: string = path.parse(file.originalname).ext;

            cb(null, `${filename}${extension}`);
        }
    })
};

@Controller('users')
export class UserController {
    constructor(
        private readonly userService: UserService,
    ) {}

    @Post()
    create(
        @Body(ValidationPipe) createUserDto: CreateUserDto
    ): Observable<User> {
        return this.userService.create(createUserDto).pipe(
            map((user: User) => user)
        );
    }

    @Post('login')
    login(
        @Body(ValidationPipe) loginUserDto: LoginUserDto
    ): Observable<Object> {
        return this.userService.login(loginUserDto).pipe(
            map((jwt: string) => {
                return {access_token: jwt};
            })
        )
    }

    @Get()
    findAll(): Observable<User[]> {
        return this.userService.findAll().pipe(
            map((users: User[]) => users)
        )
    }

    @Get(':id')
    findOne(
        @Param('id') id: number
    ): Observable<User> {
        return this.userService.findOne(id);
    }

    @Delete(':id')
    deleteOne(
        @Param('id') id: number
    ): Observable<any> {
        return this.userService.deleteOne(id);
    }

    @UseGuards(JwtAuthGuard, UserIsUserGuard)
    @Put(':id')
    updateOne(
        @Param('id') id: number,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ): Observable<User> {
        return this.userService.updateOne(id, updateUserDto);
    }

    @hasRoles(UserRole.ADMIN)
    @UseGuards(JwtAuthGuard, RolesGuard)
    @Put(':id/role')
    updateRoleOfUser(
        @Param('id') id: number,
        @Body(ValidationPipe) updateUserDto: UpdateUserDto
    ): Observable<UpdateResult> {
        return this.userService.updateRoleOfUser(Number(id), updateUserDto);
    }

    @Post('upload')
    @UseGuards(JwtAuthGuard)
    @UseInterceptors(FileInterceptor('file', storage))
    uploadFile(
        @UploadedFile() file,
        @Request() request
    ): Observable<User> {
        const user = request.user.user;
        return this.userService.updateOne(user.id, { profile_image: file.filename }).pipe(
            map((user: User) => ({ profile_image: user.profile_image }))
        )
    }

    @Get('image-profile/:imageName')
    findProfileImage(
        @Param('imageName') imageName: string,
        @Res() response
    ): Observable<User> {
        return of(response.sendFile(join(process.cwd(), 'upload/profileImages/' + imageName))).pipe(
            map(() => {
                return { profile_image: imageName }
            })
        );
    }
}
