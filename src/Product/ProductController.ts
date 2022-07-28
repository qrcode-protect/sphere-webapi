"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Product/ProductController
 */

import Controller                from "QRCP/Sphere/Common/Controller";
import { HttpContextContract }   from "@ioc:Adonis/Core/HttpContext";
import ProductService    from "QRCP/Sphere/Product/ProductService";
import { unknown }               from "@sofiakb/adonis-response";
import ProductAttributes from "./ProductAttributes";
import { currentUser }           from "App/Common/auth";


export default class ProductController extends Controller {

    protected service: ProductService

    constructor() {
        super(new ProductService())
    }

    public async store({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(<ProductAttributes>(request.body().data), (await currentUser())?.id));
    }

    async paginate({ request, response }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.paginate(request.input("page", 1), request.input("limit", 10)));
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

    public async importCsv({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.importCsv(request.file("file"), (await currentUser())?.id));
    }

    public async search({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.searchProduct((request.body()).data?.query, (await currentUser())?.id));
    }


}
