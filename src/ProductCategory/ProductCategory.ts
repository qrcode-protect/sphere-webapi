"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/ProductCategory/ProductCategory
 */

import Model                     from "QRCP/Sphere/Common/Model";
import ProductCategoryAttributes from "QRCP/Sphere/ProductCategory/ProductCategoryAttributes";
import { nameWithNumber }        from "App/Common/string";

export default class ProductCategory extends Model {
    id: string
    label: string
    name: string
    description: string
    avatar: string
    partnerId: string


    constructor(attributes?: ProductCategoryAttributes) {
        super({ collectionName: "product_categories", model: ProductCategory });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    private createName(label?: string, partnerId?: string) {
        return `${nameWithNumber(label ?? this.label, "-")}${partnerId ?? this.partnerId ? "-" + (partnerId ?? this.partnerId) : ""}`
    }

    async store(data: ProductCategoryAttributes): Promise<ProductCategory> {

        if (data.label !== data.label.toUpperCase()) {
            data.label = data.label.toLowerCase();
        }

        data.name = this.createName(data.label, data.partnerId)
        data.description = data.description ?? null
        data.avatar = data.avatar ?? null

        return super.store(data);
    }

    async update(docID: string, data, force = false): Promise<ProductCategory | Error> {

        if (typeof data.label !== "undefined") {
            if (data.label !== data.label.toUpperCase()) {
                data.label = data.label.toLowerCase();
            }

            data.name = this.createName(data.label, data.partnerId)
        }

        const productCategory = await this.doc(docID)

        if (!productCategory || productCategory.partnerId === data.partnerId)
            return new Error("degage")

        return super.update(docID, data, force);
    }
}
