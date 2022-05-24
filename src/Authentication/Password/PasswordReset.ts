"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 20:47
 * File src/Authentication/Password/PasswordReset
 */

import Model from "QRCP/Sphere/Common/Model";
import moment from "moment";


export default class PasswordReset extends Model {

    id: string
    userId: string
    token: string
    email: string
    expires: string
    redirectTo: string


    constructor(attributes?) {
        super({ collectionName: "password_resets", model: PasswordReset });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async firstOrCreate(): Promise<PasswordReset> {
        const tomorrow = moment()
        tomorrow.add(1, "day")
        return await this.update(this.userId, {
            userId : this.userId,
            token  : this.token,
            email: this.email,
            expires: tomorrow.unix(),
            redirectTo: this.redirectTo
        }, true)
    }
}
