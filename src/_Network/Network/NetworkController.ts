"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Network/NetworkController
 */

import Controller                   from "QRCP/Sphere/Common/Controller";
import NetworkService               from "QRCP/Sphere/_Network/Network/NetworkService";
import { regions }                  from "App/Common/regions";
import Network                      from "QRCP/Sphere/_Network/Network/Network";
import { each, includes }           from "lodash";
import Log                          from "QRCP/Sphere/Common/Log";
import { Result, success, unknown } from "@sofiakb/adonis-response";
import { HttpContextContract }      from "@ioc:Adonis/Core/HttpContext";
import Env                          from "@ioc:Adonis/Core/Env";
import { adminIps }                 from "Config/app";


export default class NetworkController extends Controller {

    protected service: NetworkService

    constructor() {
        super(new NetworkService())
    }

    async seeds({ request, response }: HttpContextContract) {

        if (Env.get("NODE_ENV") !== "development" && !includes(adminIps, request.ip())) {
            return unknown(response, Result.forbidden(`Accès refusé ${request.ip()}`))
        }

        await Promise.all(each(regions, async region => {
            try {
                await (new Network()).store(region)
            } catch (e) {
                Log.error(e, true)
            }
        }))

        return success(response, { ip: request.ip() })
    }

    async findActive({ response }: HttpContextContract) {
        return unknown(response, await this.service.findActive())
    }
}
