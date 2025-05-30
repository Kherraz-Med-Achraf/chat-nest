import { IsString, MinLength } from 'class-validator';

export class LoginAuthDto {
  @IsString({ message: "Le nom d'utilisateur est requis" })
  @MinLength(3, {
    message: "Le nom d'utilisateur doit contenir au moins 3 caractères",
  })
  username: string;

  @IsString()
  @MinLength(8, {
    message: 'Le mot de passe doit contenir au moins 8 caractères',
  })
  password: string;
}
