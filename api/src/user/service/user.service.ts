import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../model/user.entity';
import { DeleteResult, Like, Repository, UpdateResult } from 'typeorm';
import { User, UserRole } from '../model/user.interface';
import { catchError, from, map, Observable, switchMap, throwError } from 'rxjs';
import { AuthService } from 'src/auth/service/auth.service';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(UserEntity)
        private readonly userRepository: Repository<UserEntity>,
        private authService: AuthService
    ) {}

    create(user: User): Observable<User> {
        return this.authService.hashPassword(user.password).pipe(
            switchMap((passwordHash: string) => {
                const newUser = new UserEntity();
                newUser.firstname = user.firstname;
                newUser.lastname = user.lastname;
                newUser.email = user.email;
                newUser.role = UserRole.USER;
                newUser.password = passwordHash;

                return from(this.userRepository.save(newUser)).pipe(
                    map((user: User) => {
                        const {password, ...result}= user;
                        return result;
                    }),
                    catchError(err => throwError(err))
                );
            })
        )
    }

    findAll(): Observable<User[]> {
        return from(this.userRepository.find()).pipe(
            map((users: User[]) => {
                users.forEach(function (v) {delete v.password});
                return users;
            })
        );
    }

    findOne(id: number): Observable<User> {
        return from(this.userRepository.findOneBy({id})).pipe(
            map((user: User) => {
                const {password, ...result} = user
                return result;
            })
        );
    }

    deleteOne(id: number): Observable<DeleteResult> {
        return from(this.userRepository.delete(id));
    }

    updateOne(id: number, user: User): Observable<User> {
        delete user.password;
        delete user.email;
        delete user.role;

        this.findOne(id).subscribe((user) => {
            if (user.profile_image) {
                console.log("Supprimer son ancienne image");
            }
        });

        return from(this.userRepository.update(id, user)).pipe(
            switchMap(() => this.findOne(id))
        );
    }

    updateRoleOfUser(id: number, user: User): Observable<UpdateResult> {
        return from(this.userRepository.update(id, user));
    }

    login(user: User): Observable<string> {
        return this.validateUser(user.email, user.password).pipe(
            switchMap((user: User) => {
                if (user) {
                    return this.authService.generateJWT(user).pipe(map((jwt: string) => jwt));
                } else {
                    return 'wrong credentials'
                }
            })
        )
    }

    validateUser(mail: string, password: string): Observable<User> {
        return this.findBymail(mail).pipe(
            switchMap((user: User) => this.authService.comparePasswords(password, user.password).pipe(
                map((match: boolean) => {
                    if (match) {
                        const {password, ...result} = user;
                        return result;
                    } else {
                        throw Error;
                    }
                })
            )
        ))
    }

    findBymail(email: string): Observable<User> {
        return from(this.userRepository.findOneBy({email}));
    }
}
