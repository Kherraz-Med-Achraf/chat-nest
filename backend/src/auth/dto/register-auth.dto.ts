import { IsString, IsEmail, MinLength, Matches } from 'class-validator';

export class RegisterAuthDto {
  @IsString({
    message: "Le nom d'utilisateur doit être une chaîne de caractères",
  })
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  username: string;

  @IsEmail({}, { message: "L'email doit avoir un format valide" })
  email: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  @Matches(/^(?=.*[A-Z])(?=.*[!@#$%^&*(),.?":{}|<>])/, {
    message:
      'Le mot de passe doit contenir au moins une majuscule et un symbole spécial',
  })
  password: string;
}
