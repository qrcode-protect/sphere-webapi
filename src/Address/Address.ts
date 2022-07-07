"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Address/Address
 */

import AddressAttributes from "QRCP/Sphere/Address/AddressAttributes";

export default class Address {
    id?: string
    street_number: number
    address: string
    address2: string
    zipcode: string
    city: string
    country?: string
    lat: number
    lng: number


    constructor(attributes: AddressAttributes) {
        this.id = attributes.id
        this.street_number = attributes.street_number
        this.address = attributes.address
        this.address2 = attributes.address2
        this.zipcode = attributes.zipcode
        this.city = attributes.city
        this.country = (attributes.country ?? "FRANCE").toUpperCase()
    }

    toJson() {
        return JSON.parse(JSON.stringify(this))
    }
}
