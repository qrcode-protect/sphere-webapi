"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

export default interface AddressAttributes {
    id?: string
    street_number: number
    address: string
    address2: string
    zipcode: string
    city: string
    country?: string
}
