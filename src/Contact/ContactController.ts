"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Contact/ContactController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import ContactService          from "QRCP/Sphere/Contact/ContactService";
import { unknown }             from "@sofiakb/adonis-response";


export default class ContactController extends Controller {

    protected service: ContactService

    constructor() {
        super(new ContactService())
    }

    async send({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.send(request.body().data));
    }

}
