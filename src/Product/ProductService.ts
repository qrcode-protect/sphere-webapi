"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Product/Product
 */

import Service                         from "QRCP/Sphere/Common/Service";
import ProductAttributes               from "QRCP/Sphere/Product/ProductAttributes";
import Product                         from "QRCP/Sphere/Product/Product";
import { Result }                      from "@sofiakb/adonis-response";
import Log                             from "QRCP/Sphere/Common/Log";
import { MultipartFileContract }       from "@ioc:Adonis/Core/BodyParser";
import InvalidProductCsvEntryException from "QRCP/Sphere/Exceptions/InvalidProductCsvEntryException";
import ProductMail                     from "QRCP/Sphere/Product/ProductMail";
import { partnerModel }                from "App/Common/model";

const csv = require("csvtojson")


interface StoreProductAttributes extends ProductAttributes {
    upload?: unknown
}

export default class ProductService extends Service {

    constructor(model = Product) {
        super(model);
    }

    /*async all(): Promise<Success> {
        return Result.success(await this.model.orderBy("publishedAt", "desc").get());
    }*/

    public async store(data: StoreProductAttributes, partnerId?: string) {
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
            const data = await this.model.update(docID, { ...updatable, partnerId })
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${docID} demandée n'existe pas.`)
        }
    }

    public async importCsv(csvFile: Nullable<MultipartFileContract>, partnerId?: string) {
        try {
            if (csvFile && partnerId)
                csv({
                    delimiter: ";"
                })
                    .fromFile(csvFile?.tmpPath)
                    .then(async (products: any[]) => {
                        try {
                            console.log("finished")
                            await this.model.storeMultiple(products, partnerId);
                            console.log("stored")
                            await ProductMail.product((await partnerModel().doc(partnerId)))
                        } catch (e) {
                            Log.error(e, true)
                            if (partnerId)
                                await ProductMail.failed((await partnerModel().doc(partnerId)))
                            if (e instanceof InvalidProductCsvEntryException) {
                                return Result.badRequest("Votre fichier est incorrect")
                            }
                            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
                        }
                    }, async () => await ProductMail.failed((await partnerModel().doc(partnerId))))


            return Result.success()
        } catch (e) {
            Log.error(e, true)
            if (partnerId)
                await ProductMail.failed((await partnerModel().doc(partnerId)))
            if (e instanceof InvalidProductCsvEntryException) {
                return Result.badRequest("Votre fichier est incorrect")
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async block(docID: string, partnerId?: string) {
        return this.update(docID, { active: false }, partnerId)
    }

    public async unblock(docID: string, partnerId?: string) {
        return this.update(docID, { active: true }, partnerId)
    }

    public async searchProduct(query: string, partnerId?: string) {
        try {
            return Result.success(await this.model.whereSnapshot("partnerId", partnerId ?? null).search(query))
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }
}
