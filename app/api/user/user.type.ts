export interface CurrentUserResponseDto {
  _id: string;
  username: string;
  email: string;
}
export interface UpdateProfileRequestDto {
  username: string;
  email: string;
  password: string;
  oldPassword: string;
}
