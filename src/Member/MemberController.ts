"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Member/MemberController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import MemberService           from "QRCP/Sphere/Member/MemberService";
import { unknown }             from "@sofiakb/adonis-response";
import MemberAttributes        from "./MemberAttributes";


export default class MemberController extends Controller {

    protected service: MemberService

    constructor() {
        super(new MemberService())
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

        return unknown(response, await this.service.store(<MemberAttributes>request.body(), request.file("certificate")));
    }

    public async active(httpContextContract: HttpContextContract) {
        return super.findBy("active", true, httpContextContract);
    }

    public async inactive(httpContextContract: HttpContextContract) {
        return super.findBy("active", false, httpContextContract);
    }

    public async validate(httpContextContract: HttpContextContract) {
        return super.update(httpContextContract)
    }

}
