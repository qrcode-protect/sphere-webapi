"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 17:52
 * File src/Authentication/Password/PasswordService
 */


import AuthService                       from "QRCP/Sphere/Authentication/Auth/AuthService";
import moment                            from "moment";
import { Error as SofiakbError, Result } from "@sofiakb/adonis-response";
import { makeid }                        from "App/Common";
import PasswordReset                     from "QRCP/Sphere/Authentication/Password/PasswordReset";
import Log                               from "QRCP/Sphere/Common/Log";
import Route                             from "@ioc:Adonis/Core/Route";

import bcrypt     from "bcryptjs"
import linkConfig from "Config/link";
import AuthMail   from "QRCP/Sphere/Authentication/AuthMail";

export default class PasswordService extends AuthService {


    public create(email: string, app = "website") {
        return this.forgot(email, app);
    }

    async forgot(email: string, app = "website", sendMail = true): Promise<PasswordReset | SofiakbError> {
        if (email === null)
            return Result.badRequest("Merci de renseigner l'e-mail.");

        const user = await this.loadUserByEmail(email)

        if (user === null)
            return Result.notFound("Aucun compte n'existe avec cette adresse e-mail.");

        const token = (Buffer.from((JSON.stringify({
            "user" : user,
            "token": makeid(25),
            "date" : moment().unix()
        })))).toString("base64");

        const redirectTo = linkConfig[app].password.reset + `/${user.id}/?app=${app}&continue=${encodeURIComponent(linkConfig[app].url)}`

        const passwordReset = (new PasswordReset({ userId: user.id, token, email, redirectTo }))
        const passwordSaved = await passwordReset.firstOrCreate()

        if (sendMail) {
            const link = this.forgotLink(passwordSaved);
            await AuthMail.forgot(user, app, link);
        }

        return passwordSaved;
    }

    public async verifyToken(email, token) {
        if (token === null || email === null || (email = (Buffer.from(email, "base64")).toString("ascii")) === null)
            return Result.badRequest();

        const user = await this.loadUserByEmail(email)

        if (user === null) {
            Log.info("Aucun compte n'existe avec cette adresse e-mail. ({email})");
            return Result.notFound("Aucun compte n'existe avec cette adresse e-mail.");
        }

        const passwordReset = await (new PasswordReset()).whereSnapshot("token", token).doc(user.id)

        if (passwordReset === null)
            return Result.notFound();

        if (passwordReset.email === null)
            return Result.notFound();

        return passwordReset.redirectTo;
    }

    public forgotLink(passwordReset?: PasswordReset): string | null {
        if (passwordReset === null || typeof passwordReset === "undefined")
            return null;
        return Route.makeUrl("password.reset.verify",
            {
                email: (Buffer.from(passwordReset.email)).toString("base64"),
                token: passwordReset.token
            },
            {
                prefixUrl: linkConfig.app.url,
            });
    }

    public async reset(email: string, password: string) {
        if (email === null || password === null)
            return Result.badRequest();

        const user = await this.loadUserByEmail(email)

        if (user === null) {
            return Result.notFound("Aucun compte n'existe avec cette adresse e-mail.");
        }

        const passwordResets = await (new PasswordReset()).whereSnapshot("userId", user.id).where("expires", moment().unix(), ">=")

        if (passwordResets === null)
            return Result.unauthorized("Aucune demande n'a été faite avec cette adresse e-mail.");
        else {
            const passwordReset: PasswordReset = passwordResets[0]
            await user?.update(user.id, { password: bcrypt.hashSync(password) })
            await this.auth.updateUser(user.uid, { password: password }).catch((error) => Log.error(error))
            await passwordReset.delete(passwordReset.userId);
            return Result.success();
        }

    }

    /**
     * @param id
     * @param ip
     */
    public async findByIDAndIP(id: string, ip?: string) {
        const passwordResets = await (new PasswordReset()).whereSnapshot("userId", id).where("expires", moment().unix(), ">=")

        if (passwordResets === null)
            return Result.forbidden();
        console.log(ip)
        return passwordResets[0];
    }
}
