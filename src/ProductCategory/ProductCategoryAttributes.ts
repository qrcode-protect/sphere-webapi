"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

export default interface ProductCategoryAttributes {
    id?: string
    label: string
    name?: string
    description?: Nullable<string>
    avatar?: Nullable<string>
    partnerId?: string
}
