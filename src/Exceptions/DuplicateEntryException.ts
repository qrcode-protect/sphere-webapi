"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:35
 * File src/Exceptions/DuplicateEntryException
 */


export default class DuplicateEntryException extends Error {
    constructor(message?: string) {
        super(message || "Duplicate entry");
    }
}
