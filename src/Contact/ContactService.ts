"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Contact/Contact
 */

import Service           from "QRCP/Sphere/Common/Service";
import ContactAttributes from "QRCP/Sphere/Contact/ContactAttributes";
import Contact           from "QRCP/Sphere/Contact/Contact";
import { Result }        from "@sofiakb/adonis-response";
import ContactMail       from "QRCP/Sphere/Contact/ContactMail";


export default class ContactService extends Service {

    public async send(data: ContactAttributes) {

        const contact = new Contact(data)
        console.log(await ContactMail.contact(contact))

        return Result.success(true)

    }
}
