"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Tender/Tender
 */

import Model                from "QRCP/Sphere/Common/Model";
import TenderAttributes     from "QRCP/Sphere/Tender/TenderAttributes";
import Address              from "QRCP/Sphere/Address/Address";
import { momentToFirebase } from "App/Common/date";
import { Moment }           from "moment";
import { toBool }           from "App/Common";

export default class Tender extends Model {
    id: string
    description: string
    amount: number
    file: string
    beginAt: Moment
    endAt: Moment
    expiresAt?: Moment
    publishedAt?: Moment
    address: Address
    memberId: string
    reporter: string
    available: boolean
    active: boolean


    constructor(attributes?: TenderAttributes) {
        super({ collectionName: "tenders", model: Tender });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data: TenderAttributes): Promise<Tender> {

        // data.accepted = typeof data.accepted === "undefined" ? false : toBool(data.accepted);
        // data.declined = typeof data.declined === "undefined" ? false : toBool(data.declined);

        if (typeof data.publishedAt === "undefined")
            data.publishedAt = Model._now();

        data.beginAt = momentToFirebase(data.beginAt)
        data.endAt = momentToFirebase(data.endAt)
        data.expiresAt = momentToFirebase(data.expiresAt)
        data.publishedAt = momentToFirebase(data.publishedAt)

        data.amount = parseFloat(data.amount.toString())

        data.available = toBool(data.available)
        data.active = toBool(data.active)

        const address = new Address(data.address)

        data.memberId = data.member?.id
        delete data.member

        return super.store({ ...data, address: address.toJson() });
    }


}
