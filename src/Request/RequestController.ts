"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Request/RequestController
 */

import Controller from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import RequestService from "QRCP/Sphere/Request/RequestService";
import { unknown } from "@sofiakb/adonis-response";
import { currentUser } from "App/Common/auth";
import RequestAttributes from "QRCP/Sphere/Request/RequestAttributes";


export default class RequestController extends Controller {

    protected service: RequestService

    constructor() {
        super(new RequestService())
    }

    public async all({ response }: HttpContextContract) {
        return unknown(response, await this.service.all((await currentUser())?.id));
    }

    public async accept({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.accept(request.param("id"), <RequestAttributes>request.body(), request.file("quotation"), (await currentUser())?.id));
    }

    public async decline({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.decline(request.param("id")));
    }

    public async accepted({ response }: HttpContextContract) {
        return unknown(response, await this.service.accepted((await currentUser())?.id));
    }

    public async declined({ response }: HttpContextContract) {
        return unknown(response, await this.service.declined((await currentUser())?.id));
    }

    public async pending({ response }: HttpContextContract) {
        return unknown(response, await this.service.pending((await currentUser())?.id));
    }

    public async terminated({ response }: HttpContextContract) {
        return unknown(response, await this.service.terminated((await currentUser())?.id));
    }

    public async deniedByMember({ response }: HttpContextContract) {
        return unknown(response, await this.service.deniedByMember((await currentUser())?.id));
    }

    async paginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.paginate(request.input("page", 1), request.input("limit", 10)));
    }

    async acceptedPaginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.accepted((await currentUser())?.id, {
            paginate: true,
            page    : request.input("page", 1),
            limit   : request.input("limit", 10)
        }));
    }

    async declinedPaginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.declined((await currentUser())?.id, {
            paginate: true,
            page    : request.input("page", 1),
            limit   : request.input("limit", 10)
        }));
    }

    async pendingPaginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.pending((await currentUser())?.id, {
            paginate: true,
            page    : request.input("page", 1),
            limit   : request.input("limit", 10)
        }));
    }


    async terminatedPaginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.terminated((await currentUser())?.id, {
            paginate: true,
            page    : request.input("page", 1),
            limit   : request.input("limit", 10)
        }));
    }

    async deniedByMemberPaginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.deniedByMember((await currentUser())?.id, {
            paginate: true,
            page    : request.input("page", 1),
            limit   : request.input("limit", 10)
        }));
    }


}
