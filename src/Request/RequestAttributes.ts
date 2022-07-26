"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

import Member         from "QRCP/Sphere/Member/Member";
import Partner        from "QRCP/Sphere/Partner/Partner";
import PartnerService from "QRCP/Sphere/PartnerService/PartnerService";
import Quote          from "QRCP/Sphere/Quote/Quote";

export default interface RequestAttributes {
    id: string
    memberId: string
    partnerId: string
    serviceId: string
    quoteId: Nullable<string>
    description: string
    title: string
    amount: number
    expiresAt?: Date

    status: string

    member: Member
    partner: Partner
    service: PartnerService

    quote: Nullable<Quote>
}
