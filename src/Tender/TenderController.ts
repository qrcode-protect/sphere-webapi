"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Tender/TenderController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import TenderService            from "QRCP/Sphere/Tender/TenderService";
import { unknown }      from "@sofiakb/adonis-response";
import TenderAttributes from "./TenderAttributes";
import { currentUser }  from "App/Common/auth";


export default class TenderController extends Controller {

    protected service: TenderService

    constructor() {
        super(new TenderService())
    }

    public async store({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(<TenderAttributes>(request.body().data), { tender: request.file("file") }, (await currentUser())?.id));
    }

    public async validate({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.validate(request.param("id")));
    }

    public async deny({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.deny(request.param("id")));
    }

    public async unblock({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.unblock(request.param("id")));
    }

    public async block({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.block(request.param("id")));
    }

    public async active(httpContextContract: HttpContextContract) {
        return super.findBy("active", true, httpContextContract);
    }

    public async inactive(httpContextContract: HttpContextContract) {
        return super.findBy("active", false, httpContextContract);
    }


}
