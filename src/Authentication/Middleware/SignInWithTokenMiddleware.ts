import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { signInWithCustomToken }    from "firebase/auth";
import { Auth as firebaseAuth }     from "@firebase/auth";
import Application                  from "@ioc:Adonis/Core/Application";
import { authCustomToken }          from "App/Common/auth";

export default class SignInWithTokenMiddleware {
    public async handle({ request }: HttpContextContract, next: () => Promise<void>) {

        const customToken = authCustomToken(request)

        if (customToken) {
            await signInWithCustomToken(<firebaseAuth>Application.container.use("firebase.clientAuth"), customToken)
        }

        await next()
    }
}
