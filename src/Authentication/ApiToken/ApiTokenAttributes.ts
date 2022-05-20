"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:09
 * File src/Authentication/ApiToken/ApiTokenAttributes
 */

export default interface ApiTokenAttributes {
    id?: string;
    uid: string;
    token: string;
    loggedAt: Date;
    userId: string;
}
