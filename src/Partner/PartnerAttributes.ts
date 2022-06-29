"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

export default interface PartnerAttributes {
    id?: string,
    firstname: string,
    lastname: string,
    username?: string,
    email: string,
    phone: Nullable<string>,
    activityId: string,
    companyName: string,
    certificate: string,
    siret: string,
    active?: boolean,
    available?: boolean,
    uid?: string,
    partnerNumber?: string,
    avatar: string,
    description: string,
}
