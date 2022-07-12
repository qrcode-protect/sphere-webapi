"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/User/User
 */

import Model                                       from "QRCP/Sphere/Common/Model";
import UserAttributes                              from "QRCP/Sphere/User/UserAttributes";
import DuplicateEntryException                     from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import { cleanPersonalInformations, personalKeys } from "App/Common";
import { Role, RoleType }                          from "QRCP/Sphere/Authentication/utils/roles";

export default class User extends Model {
    id: string
    firstname: string
    lastname: string
    username?: string
    email: string
    password: string
    phone: Nullable<string>
    active?: boolean
    uid: string
    roleType: RoleType
    role: Role
    partnerId?: string


    constructor(attributes?: UserAttributes) {
        super({ collectionName: "users", model: User });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data): Promise<User> {

        const personalInfo = cleanPersonalInformations({
            firstname: data.firstname,
            lastname : data.lastname,
            username : data.username,
            phone    : data.phone,
            email    : data.email
        })

        personalKeys.forEach((key) => data[key] = personalInfo[key])

        if (typeof data.roleType === "undefined")
            data.roleType = RoleType.user;

        if (typeof data.password === "undefined")
            data.password = null;

        if (typeof data.uid === "undefined")
            data.uid = null;

        if (typeof data.active === "undefined")
            data.active = false;

        if ((await this.where("email", data.email)) !== null) {
            throw new DuplicateEntryException()
        }

        if (data.uid)
            data.id = data.uid

        return super.store(data);
    }

    async update(docID: string, data, force = false): Promise<User> {
        const dataKeys = Object.keys(data)
        const personalInfo = cleanPersonalInformations({
            firstname: data.firstname,
            lastname : data.lastname,
            username : data.username,
            phone    : data.phone,
            email    : data.email
        }, false)

        personalKeys.forEach((key) => (dataKeys.includes(key)) && typeof personalInfo[key] !== "undefined" ? data[key] = personalInfo[key] : null)

        if (personalInfo.username) {
            data.username = personalInfo.username
        }

        if (data.email) {
            if ((await this.whereSnapshot("id", docID, "!=").where("email", data.email)) !== null) {
                throw new DuplicateEntryException()
            }
        }

        return super.update(docID, data, force);
    }

    isActive(): boolean {
        return this.active === true
    }

    async whereUsername(username: Nullable<string>) {
        return username ? await this.findOneBy("username", username) : null
    }

    async whereEmail(email: Nullable<string>) {
        return email ? await this.findOneBy("email", email) : null
    }


}
