import { httpClient } from "./httpClient"

interface ISignInDTO {
    username: string
    password: string
}
interface ISignUpDTO {
    username: string
    password: string
    email: string
}

interface ISignInResponse {
    access_token: string,
    token_type: string
}

export class AuthService {
    static async signUp({ email, password, username }: ISignUpDTO) {
        const { data: response } = await httpClient.post("/auth/register", {
            email,
            password,
            username
        })

        return response
    }

    static async signIn({ username, password }: ISignInDTO) {
        const { data: response } = await httpClient.post<ISignInResponse>("/auth/token", {
            username,
            password
        }, {
            headers: {
                "Content-Type": "application/x-www-form-urlencoded"
            }
        })

        return response
    }
}