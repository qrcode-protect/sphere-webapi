"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:56
 * File app/Common/phone-cleaner
 */

import parsePhoneNumber, { PhoneNumber } from "libphonenumber-js"
import { reverse }                       from "App/Common/string";

export default class PhoneCleaner {
    get number(): Nullable<string> {
        return this._number;
    }


    private phone: PhoneNumber | undefined;
    private _number: Nullable<string>;

    private static ALLOWED_PREFIXES: string[] = [ "01", "02", "03", "04", "05", "06", "07", "08", "09" ]

    //
    /**
     * PhoneCleaner constructor.
     *
     * Le constructeur crée un nouvelle objet PhoneNumber
     * et ne garde que le numéro de tel sans l'indicatif.
     *
     * @param phone
     */
    constructor(phone: string) {

        try {
            if (phone === null || phone === "")
                throw new Error("Phone null exception");
            phone = (phone[0] === "+") ? "+" + phone.replace(/\D/g, "") : phone.replace(/\D/g, "");

            this.phone = parsePhoneNumber(phone, "FR");
            this._number = this.phone?.formatNational()?.replace(/\D/g, "");
        } catch (e) {
            this._number = phone;
        }
    }

    /**
     * Nettoie le numéro de téléphone pour ne
     * garder que les 10 derniers chiffres
     *
     */
    private cleanLengthKeep10(): void {
        this.__cleanLengthKeepSize(10);
    }


    /**
     * Nettoie le numéro de téléphone pour ne
     * garder que les 9 derniers chiffres
     *
     */
    private cleanLengthKeep9(): void {
        this.__cleanLengthKeepSize(9);
        this._number = `0${this._number}`;
    }


    /**
     * Nettoie le numéro de téléphone pour ne
     * garder que les x derniers chiffres
     *
     */
    private __cleanLengthKeepSize(size: number): void {
        const number = reverse(this._number)?.substring(0, size);
        this._number = reverse(number);
    }

    /**
     * Vérifie que le préfix du numéro correspond
     * bien à un numéro français
     *
     */
    private cleanPrefix(): void {
        if (this._number === null || this._number === "")
            return;
        const prefix = this._number?.substring(0, 2);
        this._number = prefix && PhoneCleaner.ALLOWED_PREFIXES.includes(prefix) ? this._number : null;
    }

    /**
     * Nettoie le numéro de téléphone
     *
     */
    public clean(): void {
        this.cleanLengthKeep10();
        if (this._number && this._number[0] !== "0")
            this.cleanLengthKeep9();
        // this.cleanMustBe10();
        this.cleanPrefix();
    }

}
