"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 10:10
 * File src/Authentication/AutMail
 */

import Mail            from "QRCP/Sphere/Mail/Mail";
import User            from "QRCP/Sphere/User/User";
import PasswordService from "QRCP/Sphere/Authentication/Password/PasswordService";
import PasswordReset   from "QRCP/Sphere/Authentication/Password/PasswordReset";

export default class AuthMail extends Mail {
    /**
     * @param user: User
     * @param app
     * @return bool
     * @throws GuzzleException
     */
    public static async register(user: User, app: string) {

        const passwordService = new PasswordService()
        const passwordReset = await passwordService.create(user.email, app)

        if (passwordReset instanceof PasswordReset) {
            const link = passwordService.forgotLink(passwordReset)
            switch (app) {
                case "website": {
                    return super.registerMember(user, `${link}`)
                }
                case "dashboard": {
                    return super.registerDashboard(user, `${link}`)
                }
            }
        }


    }

    /**
     * @param user: User
     * @param link: string
     * @return bool
     * @throws GuzzleException
     */
    public static async forgot(user: User, app: string, link?: string | null) {

        if (!link) {
            const passwordService = new PasswordService()
            const passwordReset = await passwordService.create(user.email, app)
            if (passwordReset instanceof PasswordReset) {
                link = passwordService.forgotLink(passwordReset)
            }
        }

        if (link)
            switch (app) {
                case "website": {
                    return super.forgotPasswordMember(user, `${link}`)
                }
                case "dashboard": {
                    return super.forgotPasswordDashUser(user, `${link}`)
                }
            }
    }
}
