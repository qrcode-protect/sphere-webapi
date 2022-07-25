"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/PartnerService/PartnerService
 */

import Model                    from "QRCP/Sphere/Common/Model";
import PartnerServiceAttributes from "QRCP/Sphere/PartnerService/PartnerServiceAttributes";
import { nameWithNumber }       from "App/Common/string";
import { partnerModel }         from "App/Common/model";
import Partner                  from "QRCP/Sphere/Partner/Partner";
import { toBool }               from "App/Common";

export default class PartnerService extends Model {
    id: string
    label: string
    name: string
    description: string
    avatar: string
    partnerId: string
    price: number
    active: boolean


    constructor(attributes?: PartnerServiceAttributes) {
        super({ collectionName: "partner_services", model: PartnerService });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    private createName(label?: string, partnerId?: string) {
        return `${nameWithNumber(label ?? this.label, "-")}${partnerId ?? this.partnerId ? "-" + (partnerId ?? this.partnerId) : ""}`
    }

    async casting(data): Promise<any> {
        const partnerReference: Partner | null = await partnerModel().findOneBy("uid", data.partnerId);

        if (partnerReference) {
            data.partner = partnerReference;
        }

        return super.casting(data);
    }

    async store(data: PartnerServiceAttributes): Promise<PartnerService> {

        if (data.label !== data.label.toUpperCase()) {
            data.label = data.label.toLowerCase();
        }

        const partner = await partnerModel().findOneBy("id", data.partnerId!)

        if (partner) {
            const partnerParent = await partnerModel().parentByName(partner.name)
            data.partnerId = partnerParent.id
        }

        data.name = this.createName(data.label, data.partnerId)
        data.description = data.description ?? null
        data.avatar = data.avatar ?? null
        data.price = data.price ? parseFloat(data.price?.toString()) : null
        data.active = typeof data.active === "undefined" ? true : toBool(data.active)

        return super.store(data);
    }

    async update(docID: string, data, force = false): Promise<PartnerService> {

        if (typeof data.label !== "undefined") {
            if (data.label !== data.label.toUpperCase()) {
                data.label = data.label.toLowerCase();
            }

            data.name = this.createName(data.label, data.partnerId)
        }

        const partnerService = await this.doc(docID)

        const partner = await partnerModel().findOneBy("id", data.partnerId!)

        if (partner) {
            const partnerParent = await partnerModel().parentByName(partner.name)
            data.partnerId = partnerParent.partnerId
        }

        if (!partnerService || partnerService.partnerId === data.partnerId)
            throw new Error("degage")

        data.price = typeof data.price === "undefined" ? data.price : data.price ? parseFloat(data.price?.toString()) : null
        data.active = typeof data.active === "undefined" ? data.active : toBool(data.active)

        return super.update(docID, data, force);
    }
}
