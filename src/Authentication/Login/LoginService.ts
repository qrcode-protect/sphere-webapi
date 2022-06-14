"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 18/05/2022 at 14:18
 * File src/Authentication/Login/LoginService
 */

import AuthService from "QRCP/Sphere/Authentication/Auth/AuthService";
import User        from "QRCP/Sphere/User/User";

import bcrypt                                     from "bcryptjs"
import Log                                        from "QRCP/Sphere/Common/Log";
import { Error as SofiakbError, Result, Success } from "@sofiakb/adonis-response";

import { signInWithEmailAndPassword }           from "@firebase/auth";
import { memberModel, partnerModel, userModel } from "App/Common/model";
import Model                                    from "QRCP/Sphere/Common/Model";
import { rolesByLevel, RoleType }               from "QRCP/Sphere/Authentication/utils/roles";
import { map }                                  from "lodash";

export type LoginResult = {
    token: { bearer: string },
    email: string
}

export default class LoginService extends AuthService {

    public async login(email: string, password: string, remember = false, loginType?: Nullable<string>): Promise<LoginResult | null | Success | SofiakbError> {

        if (email === null || password === null) {
            return null;
        }

        let user: Nullable<User>

        if ((user = await this.loadUserByEmail(email)) === null) {
            if ((user = await this.loadUserByUsername(email)) === null)
                return this.notExists();
        }

        if (!bcrypt.compareSync(password, user.password)) {
            return this.wrongPassword()
        }

        let firebaseResult = false

        if (!user.isActive()) {
            return this.notActive()
        }

        await signInWithEmailAndPassword(this.clientAuth, user.email, password)
            .then(async () => firebaseResult = true)
            .catch(() => firebaseResult = false);

        if (!firebaseResult) {
            return this.unauthorized()
        }

        const bearer = this.generateToken(user, remember)

        if (bearer === null) {
            return this.unauthorized()
        }

        await this.registerApiToken(user, bearer)

        Log.info(`Token généré pour ${user.email}`);

        if (loginType) {
            const loginSpecialResult = await this.loginSpecial(loginType, user.email)
            if (loginSpecialResult instanceof SofiakbError)
                return loginSpecialResult
        }

        return { token: { bearer }, email: user.email };
    }

    public async loginSpecial(loginType: string, email: string): Promise<Success | SofiakbError> {
        let model: Model | null = null
        switch (loginType) {
            case "dashboard": {
                const result = (await userModel().whereSnapshot("email", email).where("roleType", map(rolesByLevel(RoleType.marketing), role => role.name), "in"))
                return result ? Result.success() : this.unauthorized()
            }
            case "partners": {
                model = partnerModel()
                break;
            }
            case "members": {
                model = memberModel()
                break;
            }
            default:
                break;
        }

        if (model) {
            const result = await model.whereSnapshot("available", true).where("email", email)

            if (result === null) {
                return this.blocked()
            }

            return Result.success()
        }

        return Result.badRequest()
    }


}
