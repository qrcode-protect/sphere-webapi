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
import { Result }                from "@sofiakb/adonis-response";
import Log                       from "QRCP/Sphere/Common/Log";
import { upload }                from "App/Common/file";
import { name }                  from "App/Common/string";

interface StoreTenderAttributes extends TenderAttributes {
    upload?: unknown
}

export default class TenderService extends Service {

    constructor(model = Tender) {
        super(model);
    }

    public async store(data: StoreTenderAttributes, documents?: { tender?: Nullable<MultipartFileContract> }, reporter?: string) {
        delete data.upload

        if (documents) {
            if (documents.tender)
                data.file = await upload(documents.tender, `members/tenders/${name(data.member?.companyName ?? "unknown", "-")}`)
        }

        try {
            const result = await this.model.store({ ...data, reporter })
            if (result.id) {
                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async validate(docID: string) {
        return this.update(docID, { active: true, available: true })
    }

    public async deny(docID: string) {
        return this.update(docID, { active: false, available: false })
    }

    public async block(docID: string) {
        return this.update(docID, { available: false })
    }

    public async unblock(docID: string) {
        return this.update(docID, { available: true })
    }
}
