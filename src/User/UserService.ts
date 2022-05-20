"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/User/User
 */

import Service                                    from "QRCP/Sphere/Common/Service";
import User                                       from "QRCP/Sphere/User/User";
import { Auth, UserRecord }                       from "firebase-admin/auth";
import Application                                from "@ioc:Adonis/Core/Application";
import UserAttributes                             from "QRCP/Sphere/User/UserAttributes";
import { Error as SofiakbError, Result, Success } from "@sofiakb/adonis-response";
import Log                                        from "QRCP/Sphere/Common/Log";
import DuplicateEntryException                    from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import { rolesByLevel, RoleType }                 from "QRCP/Sphere/Authentication/utils/roles";
import { map }                                    from "lodash";
import AuthMail                                   from "QRCP/Sphere/Authentication/AuthMail";


export default class UserService extends Service {

    auth: Auth = <Auth>Application.container.use("firebase.auth")

    model: User

    constructor(model = User) {
        super(model);
    }

    public async store(data: UserAttributes, admin = true) {

        try {

            const result = await this.model.store({ ...data, ...{ active: admin ? true : data.active } })

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

                    if (admin) {
                        await AuthMail.register(user, "dashboard")
                    }
                }


                return Result.success(result)
            }

            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate("Un compte existe déjà avec cette adresse e-mail")
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    async update(value: string, updatable) {
        try {
            const data: User = await this.model.update(value, updatable)
            if (data.uid)
                await this.updateAuthUser(data)
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate("Un compte existe déjà avec cette adresse e-mail")
            }
            return Result.notFound(`La ressource #${value} demandée n'existe pas.`)
        }
    }

    async destroy(docID: string) {
        try {
            const user = await this.model.doc(docID)

            if (user && user.uid && user.uid.trim() !== "")
                await this.auth.deleteUser(user.uid)

            return Result.success(await this.model.delete(docID))
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${docID} demandée n'existe pas.`)
        }
    }

    async enable(docID: unknown): Promise<Success | SofiakbError> {
        return this.toggleActive(docID, true)
    }

    async disable(docID: unknown): Promise<Success | SofiakbError> {
        return this.toggleActive(docID, false)
    }

    async toggleActive(docID: unknown, active: boolean): Promise<Success | SofiakbError> {

        const user = (await super.update(docID, { active: active })).data

        if (!(user instanceof User)) {
            return Result.error(user)
        }

        try {
            if (user.uid)
                await this.auth.updateUser(user.uid, { disabled: !active })
            return Result.success(user)
        } catch (e) {
            return Result.error()
        }

    }

    async enableWithUid(uid: unknown): Promise<Success | SofiakbError> {
        return this.toggleActiveUid(uid, true)
    }

    async disableUid(uid: unknown): Promise<Success | SofiakbError> {
        return this.toggleActiveUid(uid, false)
    }

    async toggleActiveUid(uid: unknown, active: boolean): Promise<Success | SofiakbError> {
        const userWhere = (await super.findOneBy("uid", uid)).data
        return this.toggleActive(userWhere.id, active)
    }

    private async createAuthUser(user: User) {
        return await this.auth.createUser({
            email        : user.email,
            emailVerified: false,
            // phoneNumber  : user.phone ? `+33${user.phone.substring(1)}` : "",
            password   : "waiting-for-password",
            displayName: user.lastname + " " + user.firstname,
            // photoURL     : "https://firebasestorage.googleapis.com/v0/b/sphere-350012.appspot.com/o/profile-icon.png?alt=media&token=84e74397-02de-4d85-bd1b-1db1c0a85b40",
            disabled: !user.active,
        })
    }

    private async updateAuthUser(user: User) {
        return await this.auth.updateUser(user.uid, {
            email      : user.email,
            displayName: user.lastname + " " + user.firstname,
            disabled   : !user.active,
        })
    }

    public async dashboard() {
        const roles = rolesByLevel(RoleType.marketing)

        return Result.success(await this.model.whereSnapshot("roleType", map(roles, role => role.name), "in").orderBy("lastname").orderBy("firstname").get())
    }
}
