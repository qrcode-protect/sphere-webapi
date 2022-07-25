"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Tender/Tender
 */

import Service                   from "QRCP/Sphere/Common/Service";
import TenderAttributes          from "QRCP/Sphere/Tender/TenderAttributes";
import Tender                    from "QRCP/Sphere/Tender/Tender";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import { Result, Success }       from "@sofiakb/adonis-response";
import Log                       from "QRCP/Sphere/Common/Log";
import { upload }                from "App/Common/file";
import { name }                  from "App/Common/string";
import { memberModel }    from "App/Common/model";
import { toJson } from "App/Common";

interface StoreTenderAttributes extends TenderAttributes {
    upload?: unknown
}

export default class RequestService extends Service {

    constructor(model = Tender) {
        super(model);
    }

    async all(): Promise<Success> {
        return Result.success(await this.model.orderBy("publishedAt", "desc").get());
    }

    async upload(data: StoreTenderAttributes, documents?: { tender?: Nullable<MultipartFileContract> }) {
        delete data.upload

        if (!data.member && data.memberId) {
            const tmp = await memberModel().where("id", data.memberId);
            data.member = tmp?.length ? tmp[0] : []
        }

        if (documents) {
            if (documents.tender)
                data.file = await upload(documents.tender, `members/tenders/${name(data.member?.companyName ?? "unknown", "-")}`)
        }

        return data
    }

    public async store(data: StoreTenderAttributes, documents?: { tender?: Nullable<MultipartFileContract> }, reporter?: string, admin = true) {
        data = await this.upload(data, documents)

        // if (data.member?.premium !== true) {
        //     return Result.forbidden()
        // }

        try {
            data.address = toJson(data.address)

            const result = await this.model.store({ ...data, reporter })
            if (result.id) {
                if (admin) {
                    await this.validate(result.id)
                }

                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async edit(id: string, data: StoreTenderAttributes, documents?: { tender?: Nullable<MultipartFileContract> }) {
        data = await this.upload(data, documents)

        delete data.member

        try {
            data.address = toJson(data.address)

            const result = await this.model.update(id, data)
            if (result.id) {
                return Result.success(result)
            }
            throw new Error("Error while updating")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async fetchActive() {
        return Result.success(await this.model.whereSnapshot("active", true).orderBy("publishedAt", "desc").get());
    }

    public async fetchInactive() {
        return Result.success(await this.model.whereSnapshot("active", false).orderBy("publishedAt", "desc").get());
    }

    public async validate(docID: string) {
        return this.update(docID, { active: true, available: true })
    }

    public async deny(docID: string) {
        return this.destroy(docID)
    }

    public async block(docID: string) {
        return this.update(docID, { available: false })
    }

    public async unblock(docID: string) {
        return this.update(docID, { available: true })
    }
}
