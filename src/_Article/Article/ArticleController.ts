"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Article/ArticleController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import ArticleService          from "QRCP/Sphere/_Article/Article/ArticleService";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import { unknown }             from "@sofiakb/adonis-response";


export default class ArticleController extends Controller {

    protected service: ArticleService

    constructor() {
        super(new ArticleService())
    }

    async findByNetworkId({ response, params }: HttpContextContract): Promise<any> {
        return unknown(response, await this.service.findByNetworkId(params.networkId))
    }
}
