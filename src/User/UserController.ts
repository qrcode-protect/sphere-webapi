"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/User/UserController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import UserService             from "QRCP/Sphere/User/UserService";
import { unknown }             from "@sofiakb/adonis-response";


export default class UserController extends Controller {

    protected service: UserService

    constructor() {
        super(new UserService())
    }

    // public async store(httpContextContract: HttpContextContract) {
    // // public async store({ request, response }: HttpContextContract) {
    //     // /**
    //     //  * Schema definition
    //     //  */
    //     // const newPostSchema = schema.create({
    //     //     firstname  : schema.string(),
    //     //     lastname   : schema.string(),
    //     //     username   : schema.string.optional(),
    //     //     email      : schema.string(),
    //     //     phone      : schema.string(),
    //     //     activityId : schema.string(),
    //     //     companyName: schema.string(),
    //     //     certificate: schema.string(),
    //     //     siret      : schema.string(),
    //     // })
    //     //
    //     // /**
    //     //  * Validate request body against the schema
    //     //  */
    //     // const payload = await request.validate({ schema: newPostSchema })
    //     //
    //
    //     // return unknown(response, await this.service.store(<UserAttributes>request.body(), request.file("certificate")));
    //     console.log(httpContextContract.request.body())
    //     return super.store(httpContextContract)
    // }

    public async active(httpContextContract: HttpContextContract) {
        return super.findBy("active", true, httpContextContract);
    }

    async dashboard({ response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.dashboard());
    }

    public async inactive(httpContextContract: HttpContextContract) {
        return super.findBy("active", false, httpContextContract);
    }

    public async enable({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.enable(request.param("id")));
    }

    public async disable({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.disable(request.param("id")));
    }


}
