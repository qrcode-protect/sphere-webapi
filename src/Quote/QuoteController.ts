"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Quote/QuoteController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import QuoteService            from "QRCP/Sphere/Quote/QuoteService";
import { unknown }             from "@sofiakb/adonis-response";
import QuoteAttributes         from "./QuoteAttributes";
import { currentUser }         from "App/Common/auth";


export default class QuoteController extends Controller {

    protected service: QuoteService

    constructor() {
        super(new QuoteService())
    }

    public async store({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(<QuoteAttributes>request.body(), request.file("file"), (await currentUser())?.id));
    }

    public async acceptedByCurrentTransmitter({ response }: HttpContextContract) {
        return unknown(response, await this.service.acceptedByCurrentTransmitter((await currentUser())?.id));
    }

    public async declinedByCurrentTransmitter({ response }: HttpContextContract) {
        return unknown(response, await this.service.declinedByCurrentTransmitter((await currentUser())?.id));
    }

    public async pendingByCurrentTransmitter({ response }: HttpContextContract) {
        return unknown(response, await this.service.pendingByCurrentTransmitter((await currentUser())?.id));
    }

    public async expiredByCurrentTransmitter({ response }: HttpContextContract) {
        return unknown(response, await this.service.expiredByCurrentTransmitter((await currentUser())?.id));
    }

    public async search({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.search((request.body()).data?.query));
    }



}
