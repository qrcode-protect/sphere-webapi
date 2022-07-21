"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Activity/ActivityAttributes
 */

import Activity from "QRCP/Sphere/Activity/Activity";

export default interface ActivityAttributes {
    id?: string,
    name?: string,
    label?: string,
    avatar?: string,
    activities?: Activity[]
    createdAt?: Date
}
