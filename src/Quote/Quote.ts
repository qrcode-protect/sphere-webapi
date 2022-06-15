"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Quote/Quote
 */

import Model           from "QRCP/Sphere/Common/Model";
import QuoteAttributes from "QRCP/Sphere/Quote/QuoteAttributes";
import { toBool }      from "App/Common";
import { memberModel } from "App/Common/model";
import Member          from "QRCP/Sphere/Member/Member";

export default class Quote extends Model {
    id: string
    transmitter: string
    customer: string
    amount: number
    accepted = false
    declined = false
    acceptedAt: Date
    declinedAt: Date
    file: string
    conversationId: string
    messageId: string


    constructor(attributes?: QuoteAttributes) {
        super({ collectionName: "quotes", model: Quote });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async casting(data): Promise<any> {
        const memberReference: Member | null = await memberModel().findOneBy("uid", data.customer);

        if (memberReference) {
            data.member = memberReference;
        }

        return super.casting(data);
    }

    async store(data): Promise<Quote> {

        data.accepted = typeof data.accepted === "undefined" ? false : toBool(data.accepted);
        data.declined = typeof data.declined === "undefined" ? false : toBool(data.declined);

        if (typeof data.acceptedAt === "undefined")
            data.acceptedAt = null;

        if (typeof data.declinedAt === "undefined")
            data.declinedAt = null;

        data.amount = parseFloat(data.amount.toString())

        return super.store(data);
    }

    async findByTransmitterId(transmitterId: string): Promise<any> {
        return super.where("transmitter", transmitterId);
    }


}
