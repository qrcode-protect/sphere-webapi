"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/07/2022 at 16:15
 * File app/Common/date
 */

import { firestore }      from "firebase-admin";
import Log                from "QRCP/Sphere/Common/Log";
import moment, { Moment } from "moment";

export const momentToFirebase = (date: null | undefined | number | string | Date | Moment): Date | null => {
    try {
        return typeof date === "undefined" || date === null || date === "null" ? null : firestore.Timestamp.fromMillis(typeof date === "number" || typeof date === "string" ? parseInt(date.toString()) : moment(date).valueOf()).toDate();
    } catch (e) {
        Log.error(e, true)
        return null
    }
};
