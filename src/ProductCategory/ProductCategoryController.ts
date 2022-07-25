"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/ProductCategory/ProductCategoryController
 */

import Controller                from "QRCP/Sphere/Common/Controller";
import { HttpContextContract }   from "@ioc:Adonis/Core/HttpContext";
import ProductCategoryService    from "QRCP/Sphere/ProductCategory/ProductCategoryService";
import { unknown }               from "@sofiakb/adonis-response";
import ProductCategoryAttributes from "./ProductCategoryAttributes";
import { currentUser }           from "App/Common/auth";


export default class ProductCategoryController extends Controller {

    protected service: ProductCategoryService

    constructor() {
        super(new ProductCategoryService())
    }

    public async store({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.store(<ProductCategoryAttributes>(request.body().data), (await currentUser())?.id));
    }

    public async update({ request, response }: HttpContextContract) {
        return unknown(response, await this.service.update(request.param("id"), request.body().data, (await currentUser())?.id));
    }


}
