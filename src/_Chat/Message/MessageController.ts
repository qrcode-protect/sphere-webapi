"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Message/MessageController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import MessageService          from "QRCP/Sphere/_Chat/Message/MessageService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { unknown }             from "@sofiakb/adonis-response";
import { currentUser }         from "App/Common/auth";


export default class MessageController extends Controller {

    protected service: MessageService

    constructor() {
        super(new MessageService())
    }

    async store({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.store(request.body().data, (await currentUser())?.id))
    }
}
