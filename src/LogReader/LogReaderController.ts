"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/LogReader/LogReaderController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import { HttpContextContract } from "@ioc:Adonis/Core/HttpContext";
import LogReaderService        from "QRCP/Sphere/LogReader/LogReaderService";
import { unknown }             from "@sofiakb/adonis-response";


export default class LogReaderController extends Controller {

    protected service: LogReaderService

    constructor() {
        super(new LogReaderService())
    }

    public async listFiles({ view, request }: HttpContextContract) {
        const files = await this.service.list(request.input("fp"))
        return await view.render("log/reader", {
            files  : typeof files === "string" ? [] : files,
            content: typeof files === "string" ? files : null
        })
    }

    public async clean({ response }: HttpContextContract) {
        return unknown(response, await this.service.clean())

    }
}
