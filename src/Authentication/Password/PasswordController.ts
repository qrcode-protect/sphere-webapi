"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 09:37
 * File src/Passwordentication/Password/PasswordController
 */

import Controller                                                 from "QRCP/Sphere/Common/Controller";
import PasswordService
                                                                  from "QRCP/Sphere/Authentication/Password/PasswordService";
import { HttpContextContract }                                    from "@ioc:Adonis/Core/HttpContext";
import { error, Error as SofiakbError, Result, success, unknown } from "@sofiakb/adonis-response";
import Log                                                        from "QRCP/Sphere/Common/Log";

export default class PasswordController extends Controller {
    protected service: PasswordService

    constructor() {
        super(new PasswordService())
    }


    /**
     * Get link for forgotten password.
     *
     * @return string
     * @throws Exception
     */
    public async forgot({ request, response }: HttpContextContract) {
        const data = request.body().data
        if (data === null || !this.service.validate(data, [ "email" ]))
            return unknown(response, Result.badRequest());

        Log.info(`Mot de passe oublié (email : ${data.email})`);
        const passwordReset = await this.service.forgot(data.email)
        if (passwordReset === null)
            return error(400);

        Log.info("Vérification d'un erreur potentielle");
        if (passwordReset instanceof SofiakbError)
            return unknown(response, passwordReset);

        Log.info(`Email envoyé. (email : ${passwordReset.email})`);
        return success(response);
    }

    /**
     * Verify password reset token.
     *
     * @param response
     * @param $email
     * @param $token
     * @return RedirectResponse|mixed|string
     */
    public async verifyToken({ response, params }: HttpContextContract) {
        const link = await this.service.verifyToken(params.email, params.token)
        if (link === null)
            return error(400);

        if (link instanceof SofiakbError) {
            return unknown(response, Result.toArray(link.code));
        }

        return response.redirect(link);
    }

    /**
     * Reset password.
     *
     * @return string
     */
    public async reset({ request, response }: HttpContextContract) {
        const data = request.body().data
        if (data === null || !this.service.validate(data, [ "email", "password" ]))
            return unknown(response, Result.badRequest());
        return unknown(response, await this.service.reset(data.email, data.password));
    }

    /**
     * Find password reset by id.
     *
     * @param Request $request
     * @param string $id
     * @return mixed|string
     */
    public async findById({ request, response, params }: HttpContextContract) {
        return unknown(response, await this.service.findByIDAndIP(decodeURIComponent(params.id), request.ip()));
    }
}
