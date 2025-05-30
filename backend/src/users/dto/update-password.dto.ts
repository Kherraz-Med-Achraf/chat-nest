import { IsString, MinLength, Matches } from 'class-validator';

export class UpdatePasswordDto {
    @IsString()
    currentPassword: string;

    @IsString()
    @MinLength(8, {
        message: 'Le nouveau mot de passe doit contenir au moins 8 caractères',
    })
    @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
        message: 'Le nouveau mot de passe doit contenir au moins une majuscule et un symbole spécial',
    })
    newPassword: string;
}
