"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 18/05/2022 at 14:08
 * File src/Authentication/AuthController
 */

import Controller                                                   from "QRCP/Sphere/Common/Controller";
import AuthService                                                  from "QRCP/Sphere/Authentication/Auth/AuthService";
import User                                                         from "QRCP/Sphere/User/User";
import { Error as SofiakbError, Result, success, Success, unknown } from "@sofiakb/adonis-response";
import { HttpContextContract }                                      from "@ioc:Adonis/Core/HttpContext";
import { bearerToken }                                              from "App/Common/auth";

export default class AuthController extends Controller {
    protected service: AuthService

    constructor() {
        super(new AuthService())
    }

    /**
     * Retrieve current user.
     *
     * @return string
     */
    async user({ request, response }: HttpContextContract) {
        const user = await this.service.user(bearerToken(request));

        if (user instanceof User)
            return success(response, { user })
        else return unknown(response, user)
    }

    /**
     * Know if token is available.
     *
     * @return string
     */
    async logged({ request, response }: HttpContextContract) {
        const logged: boolean | SofiakbError | Success = await this.service.logged(bearerToken(request));
        return logged ? success(response, { logged }) : unknown(response, Result.unauthorized())
    }

    /**
     * Logout.
     *
     * @return bool
     */
    public async logout({ request, response }: HttpContextContract) {
        return success(response, 200, { result: await this.service.logout(bearerToken(request)) })
    }

    /**
     * Retrieve roles.
     *
     * @return bool
     */
    public dashboardRoles({ response }: HttpContextContract) {
        return success(response, 200, this.service.roles("dashboard"))
    }


}
