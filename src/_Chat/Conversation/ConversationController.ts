"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Conversation/ConversationController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import ConversationService     from "QRCP/Sphere/_Chat/Conversation/ConversationService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { unknown }             from "@sofiakb/adonis-response";
import { currentUser }         from "App/Common/auth";


export default class ConversationController extends Controller {

    protected service: ConversationService

    constructor() {
        super(new ConversationService())
    }

    async store({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.store(request.body().data, (await currentUser())?.id))
    }

    async history({ response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.history())
    }

    async historyByConversationId({ response, params }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.historyByConversationId(params.conversationId))
    }
}
