"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Network/Network
 */

import Service                            from "QRCP/Sphere/Common/Service";
import NetworkAttributes                  from "QRCP/Sphere/_Network/Network/NetworkAttributes";
import Network                            from "QRCP/Sphere/_Network/Network/Network";
import { Error as SofiakbError, Success } from "@sofiakb/adonis-response";

export default class NetworkService extends Service {

    constructor(model = Network) {
        super(model);
    }

    public store = async (data: NetworkAttributes) => super.store(data)

    async findActive(): Promise<Success | SofiakbError> {
        return super.findBy("active", true);
    }

    async findInactive(): Promise<Success | SofiakbError> {
        return super.findBy("active", false);
    }

}
