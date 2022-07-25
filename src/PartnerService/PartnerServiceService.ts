"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/PartnerService/PartnerService
 */

import Service                  from "QRCP/Sphere/Common/Service";
import PartnerServiceAttributes from "QRCP/Sphere/PartnerService/PartnerServiceAttributes";
import PartnerService           from "QRCP/Sphere/PartnerService/PartnerService";
import { Result }               from "@sofiakb/adonis-response";
import Log                      from "QRCP/Sphere/Common/Log";

interface StorePartnerServiceAttributes extends PartnerServiceAttributes {
    upload?: unknown
}

export default class PartnerServiceService extends Service {

    constructor(model = PartnerService) {
        super(model);
    }

    async all(partnerId?: string) {
        return partnerId ? Result.success(await this.model.whereSnapshot("partnerId", partnerId).orderBy("createdAt", "desc").get()) : Result.unauthorized();
    }

    public async store(data: StorePartnerServiceAttributes, partnerId?: string) {
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

    public async block(docID: string, partnerId?: string) {
        return this.update(docID, { active: false }, partnerId)
    }

    public async unblock(docID: string, partnerId?: string) {
        return this.update(docID, { active: true }, partnerId)
    }
}
