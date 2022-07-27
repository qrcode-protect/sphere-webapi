"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Product/Product
 */

import Model                           from "QRCP/Sphere/Common/Model";
import ProductAttributes               from "QRCP/Sphere/Product/ProductAttributes";
import { nameWithNumber }              from "App/Common/string";
import { partnerModel }                from "App/Common/model";
import { toBool }                      from "App/Common";
import { chunk, each, map }            from "lodash";
import InvalidProductCsvEntryException from "QRCP/Sphere/Exceptions/InvalidProductCsvEntryException";
import moment                          from "moment";

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
    partnerId: string
    active: boolean


    constructor(attributes?: ProductAttributes) {
        super({ collectionName: "products", model: Product });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    private createName(label?: string, categoryId?: string) {
        return `${nameWithNumber(label ?? this.label, "-")}${categoryId ?? this.categoryId ? "-" + (categoryId ?? this.categoryId) : ""}${moment().unix()}`
    }

    async store(data: ProductAttributes, store = true): Promise<Product> {

        if (data.label !== data.label.toUpperCase()) {
            data.label = data.label.toLowerCase();
        }

        const partner = await partnerModel().findOneBy("id", data.partnerId!)

        if (partner) {
            const partnerParent = await partnerModel().parentByName(partner.name)
            data.partnerId = partnerParent.id
        }

        data.name = this.createName(data.label, data.partnerId)
        // data.name = this.createName(data.label, data.categoryId)
        data.description = data.description ?? null
        data.avatar = data.avatar ?? null
        data.quantity = data.quantity ? parseInt(data.quantity?.toString()) : null
        data.discount = data.discount ? parseInt(data.discount?.toString()) : null

        data.price = data.price ? parseFloat(data.price?.toString()) : null
        data.active = typeof data.active === "undefined" ? true : toBool(data.active)

        return store ? super.store(data) : data;
    }

    async storeMultiple(products: any[], partnerId?: string) {
        const keys = [ "nom", "description", "montant", "quantite", "image" ]
        const isValid = (product: object) => {
            let valid = true
            each(keys, (key) => valid = typeof product[key] === "undefined" ? false : valid)
            return valid
        }

        const productsChunks = chunk(products, 500)

        await Promise.all(
            map(productsChunks, async (productsChunk) => {
                const batch = this.instance.batch()

                await Promise.all(
                    map(productsChunk, async (product) => {
                        if (!isValid(product))
                            throw new InvalidProductCsvEntryException()


                        const productRef = this.collection.doc()
                        const productData = await this.store({
                            label      : product.nom,
                            description: product.description,
                            quantity   : product.quantite,
                            price      : product.montant,
                            avatar     : product.image,
                            partnerId  : partnerId
                        }, false)

                        batch.set(productRef, {
                            id         : productRef.id,
                            label      : productData.label,
                            description: productData.description,
                            quantity   : productData.quantity,
                            price      : productData.price,
                            avatar     : productData.avatar,
                            partnerId  : productData.partnerId,
                            name       : productData.name,
                            discount   : productData.discount,
                            active     : productData.active,
                            createdAt  : Model._now(),
                            updatedAt  : Model._now(),
                        })
                    })
                )

                await batch.commit()
            })
        )

        return true;

    }

    async update(docID: string, data, force = false): Promise<Product> {

        if (typeof data.label !== "undefined") {
            if (data.label !== data.label.toUpperCase()) {
                data.label = data.label.toLowerCase();
            }

            data.name = this.createName(data.label, data.categoryId)
        }

        const product = await this.doc(docID)

        const partner = await partnerModel().findOneBy("id", data.partnerId!)

        if (partner) {
            const partnerParent = await partnerModel().parentByName(partner.name)
            data.partnerId = partnerParent.partnerId
        }

        if (!product || product.partnerId === data.partnerId)
            throw new Error("degage")

        // if (!product || product.categoryId === data.categoryId)
        //     throw new Error("degage")


        data.quantity = typeof data.quantity === "undefined" ? data.quantity : data.quantity ? parseInt(data.quantity?.toString()) : null
        data.discount = typeof data.discount === "undefined" ? data.discount : data.discount ? parseInt(data.discount?.toString()) : null
        data.price = typeof data.price === "undefined" ? data.price : data.price ? parseFloat(data.price?.toString()) : null
        data.active = typeof data.active === "undefined" ? data.active : toBool(data.active)

        return super.update(docID, data, force);
    }
}
