export enum UserRole {
    ADMIN = 'admin',
    EDITOR = 'editor',
    USER = 'user'
}

export interface User {
    id?: number;
    firstname?: string;
    lastname?: string;
    email?: string;
    password?: string;
    role?: UserRole;
    profileImage?: string;
}