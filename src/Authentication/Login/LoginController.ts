"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 18/05/2022 at 14:19
 * File src/Authentication/Login/LoginController
 */


import Controller                                                   from "QRCP/Sphere/Common/Controller";
import LoginService
                                                                    from "QRCP/Sphere/Authentication/Login/LoginService";
import { HttpContextContract }                                      from "@ioc:Adonis/Core/HttpContext";
import { Error as SofiakbError, Result, Success, success, unknown } from "@sofiakb/adonis-response";
import Log                                                          from "QRCP/Sphere/Common/Log";

export default class LoginController extends Controller {
    protected service: LoginService

    private logged = false

    constructor() {
        super(new LoginService())
    }

    /*
    |--------------------------------------------------------------------------
    | Login Controller
    |--------------------------------------------------------------------------
    |
    | This controller handles authenticating users for the application and
    | redirecting them to your home screen. The controller uses a trait
    | to conveniently provide its functionality to your applications.
    |
    */

    /**
     * Login with credentials.
     *
     */
    public async login({ request, response, params }: HttpContextContract): Promise<any> {

        const data = request.body().data ?? request.body()
        if (data === null || !this.service.validate(data, [ "email", "password" ]))
            return unknown(response, Result.badRequest());

        Log.info("Connexion de " + data.email);
        const token = await this.service.login(data.email, data.password, data.remember, params.loginType)

        if (token === null)
            return unknown(response, Result.unauthorized());

        Log.info("Vérification d'un erreur potentielle");
        if (token instanceof SofiakbError)
            return unknown(response, token);

        Log.info(data.email + " est connecté");
        this.logged = true
        return success(response, token);
    }

    /**
     * Login with credentials.
     *
     * @return string
     */
    public async loginSpecial(httpContextContract: HttpContextContract) {
        const loginResult = (await this.login(httpContextContract))
        if (this.logged) {
            const loginSpecialResult = await this.service.loginSpecial(httpContextContract.params.loginType, (httpContextContract.request.body().data ?? httpContextContract.request.body()).email)
            if (loginSpecialResult instanceof Success) {
                return loginResult
            } else return unknown(httpContextContract.response, loginSpecialResult);
        } else return loginResult;
    }

    /**
     * Retrieve login url.
     *
     * @return string
     */
    public async getLoginUrl({response, params}: HttpContextContract) {
        return unknown(response, this.service.getLoginUrl(params.loginType));
    }


}
