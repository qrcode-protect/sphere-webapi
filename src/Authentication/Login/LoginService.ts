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

import bcrypt                             from "bcryptjs"
import Log                                from "QRCP/Sphere/Common/Log";
import { Error as SofiakbError, Success } from "@sofiakb/adonis-response";

import { signInWithEmailAndPassword } from "@firebase/auth";

export type LoginResult = {
    token: { bearer: string },
}

export default class LoginService extends AuthService {

    public async login(email: string, password: string, remember = false): Promise<LoginResult | null | Success | SofiakbError> {

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
        return { token: { bearer } };
    }


}
