"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Request/Request
 */

import Model                                                                     from "QRCP/Sphere/Common/Model";
import RequestAttributes                                                         from "QRCP/Sphere/Request/RequestAttributes";
import Member                                                                    from "QRCP/Sphere/Member/Member";
import Partner                                                                   from "QRCP/Sphere/Partner/Partner";
import PartnerService                                                            from "QRCP/Sphere/PartnerService/PartnerService";
import Quote                                                                     from "QRCP/Sphere/Quote/Quote";
import { memberModel, partnerModel, partnerServiceModel, quoteModel, userModel } from "App/Common/model";
import { RoleType }                                                              from "QRCP/Sphere/Role/RoleType";

export default class Request extends Model {
    id: string
    memberId: string
    partnerId: string
    serviceId: string
    quotationId: Nullable<string>
    description: string
    title: string

    status: string

    member: Member
    partner: Partner
    service: PartnerService

    quote: Nullable<Quote>


    constructor(attributes?: RequestAttributes) {
        super({ collectionName: "requests", model: Request });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async casting(data): Promise<any> {

        data.partner = await this.withPartner(data.partnerId);
        data.member = await this.withMember(data.memberId);
        data.service = await this.withService(data.serviceId);
        data.quote = await this.withQuotation(data.quotationId);

        data.pending = this.pending(data.status)
        data.accepted = this.accepted(data.status)
        data.declined = this.declined(data.status)

        return super.casting(data);
    }

    async byUserId(partnerId?: string): Promise<this> {
        const admin = partnerId ? (await userModel().whereSnapshot("roleType", RoleType.admin).findOneBy("uid", partnerId)) : null
        return admin ? this : this.whereSnapshot("partnerId", partnerId ?? null);
    }

    async withPartner(partnerId: string): Promise<any> {
        return <Nullable<Partner>>(await partnerModel().findOneBy("uid", partnerId));
    }

    async withMember(memberId: string): Promise<any> {
        return <Nullable<Partner>>(await memberModel().findOneBy("uid", memberId));
    }

    async withService(serviceId: string): Promise<any> {
        return <Nullable<Partner>>(await partnerServiceModel().findOneBy("id", serviceId));
    }

    async withQuotation(quotationId: string): Promise<any> {
        return quotationId ? <Nullable<Partner>>(await quoteModel().findOneBy("id", quotationId)) : null;
    }

    // async update(docID: string, data, force = false): Promise<Request> {
    //     return super.update(docID, this.prepareData(data, true), force);
    // }

    public accepted(status?:string ): boolean {
        return (status ?? this.status).toUpperCase() === "ACCEPTED"
    }

    public declined(status?:string ): boolean {
        return (status ?? this.status).toUpperCase() === "DECLINED"
    }

    public pending(status?:string ): boolean {
        return !(this.accepted(status) || this.declined(status))
    }

    async accept(docID: string, quotationId: string) {
        return this.update(docID, { status: "ACCEPTED", quotationId })
    }

    async decline(docID: string) {
        return this.update(docID, { status: "DECLINED" })
    }


}
