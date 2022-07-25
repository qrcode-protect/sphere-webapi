"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

import { Moment }                from "moment";
import Member                    from "QRCP/Sphere/Member/Member";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import AddressAttributes         from "QRCP/Sphere/Address/AddressAttributes";

export default interface RequestAttributes {
    id?: string
    title: string
    description: string
    amount: Nullable<number>
    file: string
    tender: Nullable<MultipartFileContract>
    beginAt: Date | Moment | null
    endAt: Date | Moment | null
    expiresAt?: Date | Moment | null
    publishedAt?: Date | Moment | null
    member?: Member
    memberId?: string
    reporter?: Nullable<string>
    address: AddressAttributes
    available?: boolean
    active?: boolean
    public?: boolean
    activityId?: string | null
    activities?: string[] | string
}
