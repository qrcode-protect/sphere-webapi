"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

import Partner from "QRCP/Sphere/Partner/Partner";

export default interface ProductAttributes {
    id?: string
    label: string
    name?: string
    description?: Nullable<string>
    avatar?: Nullable<string>
    categoryId?: string
    quantity?: Nullable<number>
    price?: Nullable<number>
    discount?: Nullable<number>
    partnerId?: string
    partner?: Partner
    active?: Nullable<boolean>
}
