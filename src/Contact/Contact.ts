"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Contact/Contact
 */

import ContactAttributes from "QRCP/Sphere/Contact/ContactAttributes";
import { capitalize }    from "App/Common/string";

export default class Contact  {
    id: string
    lastname: string
    firstname: string
    email: string
    phone: string
    message: string


    constructor(attributes: ContactAttributes) {
        this.id = attributes.id
        this.lastname = attributes.lastname.toLowerCase()
        this.firstname = attributes.firstname.toLowerCase()
        this.email = attributes.email.toLowerCase()
        this.phone = attributes.phone
        this.message = attributes.message
    }

    toString(): string {
        return `Nom : ${capitalize(this.lastname)}\tPrénom : ${capitalize(this.firstname)}\n\nAdresse e-mail : ${this.email}\n\nN°téléphone : ${this.phone}\n\nMessage : ${this.message}`
    }
}
