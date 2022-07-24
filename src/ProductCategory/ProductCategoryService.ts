"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/ProductCategory/ProductCategory
 */

import Service                   from "QRCP/Sphere/Common/Service";
import ProductCategoryAttributes from "QRCP/Sphere/ProductCategory/ProductCategoryAttributes";
import ProductCategory           from "QRCP/Sphere/ProductCategory/ProductCategory";
import { Result }                from "@sofiakb/adonis-response";
import Log                       from "QRCP/Sphere/Common/Log";

interface StoreProductCategoryAttributes extends ProductCategoryAttributes {
    upload?: unknown
}

export default class ProductCategoryService extends Service {

    constructor(model = ProductCategory) {
        super(model);
    }

    /*async all(): Promise<Success> {
        return Result.success(await this.model.orderBy("publishedAt", "desc").get());
    }*/

    public async store(data: StoreProductCategoryAttributes, partnerId?: string) {
        try {
            if (!partnerId)
                return Result.unauthorized()
            const result = await this.model.store({ ...data, partnerId })
            if (result.id) {
                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async update(docID: unknown, updatable, partnerId?: string) {
        try {
            const data = await this.model.update(docID, { ...updatable, partnerId})
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${docID} demandée n'existe pas.`)
        }
    }
}
