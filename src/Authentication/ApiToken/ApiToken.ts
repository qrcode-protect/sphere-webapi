"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:08
 * File src/Authentication/ApiToken
 */

import ApiTokenAttributes from "QRCP/Sphere/Authentication/ApiToken/ApiTokenAttributes";
import Model              from "QRCP/Sphere/Common/Model";

export default class ApiToken extends Model {
    id: string;
    uid: string;
    token: string;
    loggedAt: Date;
    userId: string;

    constructor(attributes?: ApiTokenAttributes) {
        super({ collectionName: "api_tokens", model: ApiToken });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }
}
