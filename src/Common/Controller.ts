"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 04/05/2022 at 14:34
 * File src/Common/Controller
 */

import Service                 from "QRCP/Sphere/Common/Service";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { unknown }             from "@sofiakb/adonis-response";

export default class Controller {

    protected service: Service

    constructor(service: Service) {
        this.service = service
    }

    public async all({ response }: HttpContextContract) {
        return unknown(response, await this.service.all());
    }

    public async findById({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.findById(request.param("id")));
    }

    public async search({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.search(request.input("query")));
    }

    public async paginate({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.paginate(request.param("page", 0), request.input("limit", 18)));
    }

    public async store({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(request.body()));
    }

    public async update({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.update(request.param("id"), request.body()));
    }

    public async destroy({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.destroy(request.param("id")));
    }
}
