"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:35
 * File src/Exceptions/DuplicateEntryException
 */


export default class InvalidProductCsvEntryException extends Error {
    constructor(message?: string) {
        super(message || "Invalid product csv");
    }
}
