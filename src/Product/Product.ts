"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Product/Product
 */

import Model              from "QRCP/Sphere/Common/Model";
import ProductAttributes  from "QRCP/Sphere/Product/ProductAttributes";
import { nameWithNumber } from "App/Common/string";

export default class Product extends Model {
    id: string
    label: string
    name: string
    description: string
    avatar: string
    categoryId?: string
    quantity: number
    price: number
    discount: number


    constructor(attributes?: ProductAttributes) {
        super({ collectionName: "products", model: Product });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    private createName(label?: string, categoryId?: string) {
        return `${nameWithNumber(label ?? this.label, "-")}${categoryId ?? this.categoryId ? "-" + (categoryId ?? this.categoryId) : ""}`
    }

    async store(data: ProductAttributes): Promise<Product> {

        if (data.label !== data.label.toUpperCase()) {
            data.label = data.label.toLowerCase();
        }

        data.name = this.createName(data.label, data.categoryId)
        data.description = data.description ?? null
        data.avatar = data.avatar ?? null
        data.quantity = data.quantity ? parseInt(data.quantity?.toString()) : null
        data.discount = data.discount ? parseInt(data.discount?.toString()) : null
        data.price = data.price ?? null

        return super.store(data);
    }

    async update(docID: string, data, force = false): Promise<Product> {

        if (typeof data.label !== "undefined") {
            if (data.label !== data.label.toUpperCase()) {
                data.label = data.label.toLowerCase();
            }

            data.name = this.createName(data.label, data.categoryId)
        }

        const product = await this.doc(docID)

        if (!product || product.categoryId === data.categoryId)
            throw new Error("degage")


        data.quantity = typeof data.quantity === "undefined" ? data.quantity : data.quantity ? parseInt(data.quantity?.toString()) : null
        data.discount = typeof data.discount === "undefined" ? data.discount : data.discount ? parseInt(data.discount?.toString()) : null
        data.price = typeof data.price === "undefined" ? data.price : data.price ?? null

        return super.update(docID, data, force);
    }
}
