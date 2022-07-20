"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Quote/Quote
 */

import Model                         from "QRCP/Sphere/Common/Model";
import QuoteAttributes               from "QRCP/Sphere/Quote/QuoteAttributes";
import { toBool }                    from "App/Common";
import { memberModel, partnerModel } from "App/Common/model";
import Member                        from "QRCP/Sphere/Member/Member";
import { firestore }                 from "firebase-admin";
import Log                           from "QRCP/Sphere/Common/Log";
import Partner                 from "QRCP/Sphere/Partner/Partner";
import { concat, map, uniqBy } from "lodash";

export default class Quote extends Model {
    id: string
    transmitter: string
    customer: string
    amount: number
    accepted = false
    declined = false
    acceptedAt: Date
    declinedAt: Date
    expiresAt: Date
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

        const partnerReference: Partner | null = await partnerModel().findOneBy("uid", data.transmitter);

        if (partnerReference) {
            data.partner = partnerReference;
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

        try {
            data.expiresAt = typeof data.expiresAt === "undefined" || data.expiresAt === null || data.expiresAt === "null" ? null : firestore.Timestamp.fromMillis(data.expiresAt).toDate();
        } catch (e) {
            Log.error(e, true)
            data.expiresAt = null
        }

        data.amount = parseFloat(data.amount.toString())

        return super.store(data);
    }

    async findByTransmitterId(transmitterId: string): Promise<any> {
        return super.where("transmitter", transmitterId);
    }

    async byPartnerEmail(email: string) {
        return  await partnerModel().whereSnapshot("email", email, ">=")
            .whereSnapshot("email", email + "\uf8ff", "<=")
            .limit(10)
            .get() || []
    }

    async search(query: string) {
        const partners = await partnerModel().search(query)
        const members = await memberModel().search(query)


        const byPartner = partners && partners.length > 0 ? await this.where("transmitter", map(partners, partner => partner.id), "in") : []
        const byMember = members && members.length > 0 ? await this.where("customer", map(members, member => member.id), "in") : []

        return uniqBy(concat(byMember, byPartner), "id").filter((item) => item)
    }


}
