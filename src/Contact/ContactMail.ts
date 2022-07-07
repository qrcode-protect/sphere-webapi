"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 20/05/2022 at 10:10
 * File src/Contact/ContactMail
 */

import Mail                      from "QRCP/Sphere/Mail/Mail";
import Contact                   from "QRCP/Sphere/Contact/Contact";
import mailConfig                from "Config/mail";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";

export default class ContactMail extends Mail {
    /**
     * @return bool
     * @param contact
     * @param file
     */
    public static async contact(contact: Contact, file: Nullable<MultipartFileContract>) {
        return super.text(mailConfig.recipients.contact, "Nouveau message depuis reseau-sphere.com", contact.toString(), file)
    }
}
