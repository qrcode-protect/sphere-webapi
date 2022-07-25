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
import moment, { Moment }   from "moment";
import { toBool }           from "App/Common";

export default class Request extends Model {
    id: string
    title: string
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
    public: boolean
    activityId: string
    activities: string[]


    constructor(attributes?: TenderAttributes) {
        super({ collectionName: "tenders", model: Request });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    prepareData(data: TenderAttributes, update = false) {
        if (typeof data.publishedAt === "undefined" && !update)
            data.publishedAt = Model._now();

        data.beginAt = typeof data.beginAt === "undefined" && update ? data.beginAt : momentToFirebase(data.beginAt)
        data.endAt = typeof data.endAt === "undefined" && update ? data.endAt : momentToFirebase(data.endAt)
        data.expiresAt = typeof data.expiresAt === "undefined" && update ? data.expiresAt : momentToFirebase(data.expiresAt)
        data.publishedAt = typeof data.publishedAt === "undefined" && update ? data.publishedAt : momentToFirebase(moment().valueOf())

        data.amount = typeof data.amount === "undefined" && update ? data.amount : (data.amount ? parseFloat(data.amount.toString()) : null)

        data.available = typeof data.available === "undefined" && update ? data.available : toBool(data.available)
        data.active = typeof data.active === "undefined" && update ? data.active : toBool(data.active)
        data.public = typeof data.public === "undefined" && update ? data.public : toBool(data.public)

        data.reporter = typeof data.reporter === "undefined" && update ? data.reporter ?? null : data.reporter

        const address = typeof data.address === "undefined" && update ? data.address : new Address(data.address)

        data.memberId = data.memberId ?? data.member?.id
        delete data.member

        data.activities = typeof data.activities === "string" ? data.activities.toString().split(",") : data.activities

        return address instanceof Address ? { ...data, address: address.toJson() } : data
    }

    async store(data: TenderAttributes): Promise<Request> {
        return super.store(this.prepareData(data));
    }

    async update(docID: string, data, force = false): Promise<Request> {
        return super.update(docID, this.prepareData(data, true), force);
    }


}
