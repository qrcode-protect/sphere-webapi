"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 17:46
 * File src/Authentication/Register/RegisterService
 */


import AuthService             from "QRCP/Sphere/Authentication/Auth/AuthService";
import { userModel }           from "App/Common/model";
import User                    from "QRCP/Sphere/User/User";
import { UserRecord }          from "firebase-admin/lib/auth";
import { Result }              from "@sofiakb/adonis-response";
import Log                     from "QRCP/Sphere/Common/Log";
import DuplicateEntryException from "QRCP/Sphere/Exceptions/DuplicateEntryException";

export default class RegisterService extends AuthService {

    /**
     * Register user
     *
     */
    public async register(data) {


        try {

            const result = await userModel().store(data)

            if (result.id) {

                if (result instanceof User) {
                    const user: User = result
                    let authUser: UserRecord

                    try {
                        authUser = await this.auth.getUserByEmail(user.email)
                    } catch (e) {
                        authUser = await this.createAuthUser(user)
                    }

                    await this.model.update(user.id, { uid: authUser.uid })
                    result.uid = authUser.uid
                }

                return Result.success(result)
            }

        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate("Un compte existe déjà avec cette adresse e-mail")
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }


    }

    private async createAuthUser(user: User) {
        return await this.auth.createUser({
            email        : user.email,
            emailVerified: false,
            password     : "waiting-for-password",
            displayName  : user.lastname + " " + user.firstname,
            disabled     : !user.active,
        })
    }
}
