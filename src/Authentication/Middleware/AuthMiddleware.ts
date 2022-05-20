import type { HttpContextContract } from "@ioc:Adonis/Core/HttpContext"
import { apiTokenModel }            from "App/Common/model";
import ApiToken                     from "QRCP/Sphere/Authentication/ApiToken/ApiToken";
import Jwt                          from "QRCP/Sphere/Authentication/Jwt";
import Application                  from "@ioc:Adonis/Core/Application";
import { RoleType }                 from "QRCP/Sphere/Authentication/utils/roles";
import { validateRole }             from "QRCP/Sphere/Authentication/Middleware/utils";

export default class AuthMiddleware {

    jwt: Jwt = <Jwt>Application.container.use("jwt");
    apiTokenModel: ApiToken = apiTokenModel();


    public async handle({ request, response }: HttpContextContract, next: () => Promise<void>) {

        return validateRole(RoleType.user, request, response, next)

        /*const _bearerToken = bearerToken(request);

        let apiToken: ApiToken
        if (!_bearerToken || _bearerToken.trim() === "" || !this.jwt.verify(_bearerToken) || ((apiToken = (await this.apiTokenModel.findOneBy("token", _bearerToken))) === null)) {
            return unknown(response, Result.unauthorized());
        }

        Application.container.bind("current.apiToken", (): ApiToken => apiToken)

        const user = await userModel().findOneBy("id", apiToken.userId)

        if (user === null) {
            return unknown(response, Result.unauthorized());
        }

        user.role = retrieveRole(user.roleType)
        Application.container.bind("current.user", (): User => user)


        await next()*/
    }
}
