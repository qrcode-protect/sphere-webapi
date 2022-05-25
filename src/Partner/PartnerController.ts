"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Partner/PartnerController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import PartnerService          from "QRCP/Sphere/Partner/PartnerService";
import { unknown }             from "@sofiakb/adonis-response";
import PartnerAttributes       from "./PartnerAttributes";


export default class PartnerController extends Controller {

    protected service: PartnerService

    constructor() {
        super(new PartnerService())
    }

    public async store({ request, response }: HttpContextContract) {
        // /**
        //  * Schema definition
        //  */
        // const newPostSchema = schema.create({
        //     firstname  : schema.string(),
        //     lastname   : schema.string(),
        //     username   : schema.string.optional(),
        //     email      : schema.string(),
        //     phone      : schema.string(),
        //     activityId : schema.string(),
        //     companyName: schema.string(),
        //     certificate: schema.string(),
        //     siret      : schema.string(),
        // })
        //
        // /**
        //  * Validate request body against the schema
        //  */
        // const payload = await request.validate({ schema: newPostSchema })
        //

        return unknown(response, await this.service.store(<PartnerAttributes>request.body(), request.file("certificate")));
    }

    public async storeFromDashboard({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(<PartnerAttributes>request.body(), request.file("certificate"), true));
    }

    public async active({ response, params }: HttpContextContract) {
        return unknown(response, await this.service.findActive(params.activityId));
    }

    public async inactive(httpContextContract: HttpContextContract) {
        return super.findBy("active", false, httpContextContract);
    }

    public async validate({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.validate(request.param("id")));
    }

    public async deny({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.deny(request.param("id")));
    }

    public async groupBy({ response, params }: HttpContextContract) {
        return unknown(response, await this.service.groupBy(params.group));
    }


}
