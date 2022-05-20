"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 16:52
 * File src/Authentication/Middleware/utils/index
 */

import { bearerToken }                                from "App/Common/auth";
import ApiToken                                       from "QRCP/Sphere/Authentication/ApiToken/ApiToken";
import { Result, unknown }                            from "@sofiakb/adonis-response";
import Application                                    from "@ioc:Adonis/Core/Application";
import { apiTokenModel as xApiTokenModel, userModel } from "App/Common/model";
import { retrieveRole, RoleType }                     from "QRCP/Sphere/Authentication/utils/roles";
import User                                           from "QRCP/Sphere/User/User";
import { RequestContract }                            from "@ioc:Adonis/Core/Request";
import { ResponseContract }                           from "@ioc:Adonis/Core/Response";
import Jwt                                            from "QRCP/Sphere/Authentication/Jwt";

export const validateRole = async (roleType: RoleType, request: RequestContract, response: ResponseContract, next: () => Promise<void>) => {
    const jwt: Jwt = <Jwt>Application.container.use("jwt");
    const apiTokenModel: ApiToken = xApiTokenModel();

    const _bearerToken = bearerToken(request);

    let apiToken: ApiToken
    if (!_bearerToken || _bearerToken.trim() === "" || !jwt.verify(_bearerToken) || ((apiToken = (await apiTokenModel.findOneBy("token", _bearerToken))) === null)) {
        return unknown(response, Result.unauthorized());
    }

    Application.container.bind("current.apiToken", (): ApiToken => apiToken)

    const user = await userModel().findOneBy("id", apiToken.userId)

    if (user === null) {
        return unknown(response, Result.unauthorized());
    }

    user.role = retrieveRole(user.roleType)
    const requiredRole = retrieveRole(roleType)
    if (roleType === RoleType.user || user.role.level < requiredRole.level) {
        Application.container.bind("current.user", (): User => user)
        return await next()
    } else {
        return unknown(response, Result.forbidden());
    }


}
