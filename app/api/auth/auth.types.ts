export interface LoginRequestDto {
  email: string;
  password: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface LoginResponseDto {
  accessToken: string;
  refreshToken: string;
}

export interface GetCount {
  jobs: string;
  employer: string;
  application:string;
  appoinment:string;
  title: string;
  id: number;
  count:string
}
