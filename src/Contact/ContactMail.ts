"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 10:10
 * File src/Contact/ContactMail
 */

import Mail       from "QRCP/Sphere/Mail/Mail";
import Contact    from "QRCP/Sphere/Contact/Contact";
import mailConfig from "Config/mail";

export default class ContactMail extends Mail {
    /**
     * @return bool
     * @param contact
     */
    public static async contact(contact: Contact) {
        return super.text(mailConfig.recipients.contact, "Nouveau message depuis reseau-sphere.com", contact.toString())
    }
}
