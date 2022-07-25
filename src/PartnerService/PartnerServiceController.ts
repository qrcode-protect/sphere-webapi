"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/PartnerService/PartnerServiceController
 */

import Controller               from "QRCP/Sphere/Common/Controller";
import { HttpContextContract }  from "@ioc:Adonis/Core/HttpContext";
import PartnerServiceService    from "QRCP/Sphere/PartnerService/PartnerServiceService";
import { unknown }              from "@sofiakb/adonis-response";
import PartnerServiceAttributes from "./PartnerServiceAttributes";
import { currentUser }          from "App/Common/auth";


export default class PartnerServiceController extends Controller {

    protected service: PartnerServiceService

    constructor() {
        super(new PartnerServiceService())
    }

    public async all({ response }: HttpContextContract) {
        return unknown(response, await this.service.all((await currentUser())?.id));
    }

    async findById(httpContextContract: HttpContextContract): Promise<any> {
        return super.findOneBy("id", httpContextContract.params.id, httpContextContract);
    }

    public async store({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(<PartnerServiceAttributes>(request.body().data), (await currentUser())?.id));
    }

    public async update({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.update(request.param("id"), request.body().data, (await currentUser())?.id));
    }

    public async unblock({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.unblock(request.param("id"), (await currentUser())?.id));
    }

    public async block({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.block(request.param("id"), (await currentUser())?.id));
    }


}
