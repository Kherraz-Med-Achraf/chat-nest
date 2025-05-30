import { IsOptional, IsString, IsEmail, MinLength } from 'class-validator';

export class UpdateProfileDto {
    @IsOptional()
    @IsString({ message: 'Le nom d\'utilisateur doit être une chaîne de caractères' })
    @MinLength(3, { message: 'Le nom d\'utilisateur doit contenir au moins 3 caractères' })
    username?: string;

    @IsOptional()
    @IsEmail({}, { message: 'L\'email doit avoir un format valide' })
    email?: string;

    @IsOptional()
    @IsString({ message: 'La couleur du texte doit être une chaîne de caractères' })
    colorText?: string;

    @IsOptional()
    @IsString({ message: 'La couleur de fond doit être une chaîne de caractères' })
    colorBg?: string;
}
