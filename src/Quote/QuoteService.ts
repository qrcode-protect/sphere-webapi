"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Quote/Quote
 */

import Service                          from "QRCP/Sphere/Common/Service";
import QuoteAttributes                  from "QRCP/Sphere/Quote/QuoteAttributes";
import Quote                            from "QRCP/Sphere/Quote/Quote";
import { MultipartFileContract }        from "@ioc:Adonis/Core/BodyParser";
import Drive                            from "../../config/drive";
import path                             from "path";
import Application                      from "@ioc:Adonis/Core/Application";
import { Bucket, GetSignedUrlResponse } from "@google-cloud/storage";
import { Result }                       from "@sofiakb/adonis-response";
import Log                              from "QRCP/Sphere/Common/Log";
import Config                           from "@ioc:Adonis/Core/Config";
import moment                           from "moment";
import { conversationModel, userModel } from "App/Common/model";
import Model                            from "QRCP/Sphere/Common/Model";
import { concat, map, orderBy }         from "lodash";
import { RoleType }                     from "QRCP/Sphere/Authentication/utils/roles";

interface StoreQuoteAttributes extends QuoteAttributes {
    upload?: unknown
}

interface FetchByStatusParameters {
    accepted?: boolean,
    declined?: boolean,
    withoutExpires?: boolean,
    onlyExpired?: boolean,
}

export default class QuoteService extends Service {

    constructor(model = Quote) {
        super(model);
    }

    public async store(data: StoreQuoteAttributes, quote?: Nullable<MultipartFileContract>, transmitter?: string) {
        delete data.upload

        if (quote) {
            const quoteFilename = `${moment().unix()}.${quote.extname}`;
            const quotePath: string = Drive.disks.uploads.root
            const quoteFullPath: string = path.resolve(Drive.disks.uploads.root, quoteFilename)
            const destinationPath = `quotes/${quoteFilename}`
            await quote.move(quotePath, { name: quoteFilename })

            const bucket: Bucket = <Bucket>Application.container.use("firebase.storage")

            await bucket.upload(quoteFullPath, {
                destination: destinationPath,
            });

            await bucket.file(destinationPath)
                .getSignedUrl({ action: "read", expires: "01-01-2491" })
                .then((signedUrl: GetSignedUrlResponse) => data.file = signedUrl[0])
                .catch(() => data.file = data.file = `https://firebasestorage.googleapis.com/v0/b/${Config.get("firebase.projectId")}.appspot.com/o/${encodeURIComponent(destinationPath)}?alt=media`)
        }

        try {
            const result = await this.model.store({ ...data, transmitter })
            if (result.id) {
                if (quote)
                    await conversationModel().updateMessage(data.conversationId, data.messageId, {
                        attachmentID: result.id,
                        attachment  : data.file
                    })
                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async byCurrentTransmitterWithStatus({
                                                    accepted,
                                                    declined,
                                                    withoutExpires,
                                                    onlyExpired,
                                                }: FetchByStatusParameters, currentTransmitterId?: string) {
        try {
            if (currentTransmitterId) {

                const user = await userModel().doc(currentTransmitterId)
                const isAdmin = user?.roleType === RoleType.admin

                const query = this.model.whereSnapshot("accepted", accepted === true).whereSnapshot("declined", declined === true);

                if (withoutExpires === true) {
                    const expired = await query.whereSnapshot("expiresAt", moment().toDate(), "<").get()
                    const notExpired = await (this.model.whereSnapshot("accepted", accepted === true).whereSnapshot("declined", declined === true)).whereSnapshot("expiresAt", moment().toDate(), ">=").get()
                    const withoutExpiredQuery = (this.model.whereSnapshot("accepted", accepted === true).whereSnapshot("declined", declined === true)).whereSnapshot("expiresAt", null);
                    const withoutExpiresAtQuery = (expired && expired.length > 0 ? withoutExpiredQuery.whereSnapshot("id", map(expired, _item => _item.id), "not-in") : withoutExpiredQuery).orderBy("id", "desc").orderBy("createdAt", "desc")

                    const withoutExpiresAt = await (isAdmin ? withoutExpiredQuery : withoutExpiresAtQuery.whereSnapshot("transmitter", currentTransmitterId)).get()

                    return Result.success(orderBy(concat(withoutExpiresAt, notExpired).filter(_item => _item !== null), "createdAt", "desc"))
                }

                const prequery = (onlyExpired === true ? query.whereSnapshot("expiresAt", moment().toDate(), "<") : query);

                return Result.success(await (isAdmin ? prequery : prequery.whereSnapshot("transmitter", currentTransmitterId)).orderBy("expiresAt", "desc").orderBy("createdAt", "desc").get())
            }
            throw new Error(`Target [currentTransmitterId] is missing ${currentTransmitterId}`)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async acceptedByCurrentTransmitter(currentTransmitterId?: string) {
        return this.byCurrentTransmitterWithStatus({ accepted: true }, currentTransmitterId)
    }

    public async declinedByCurrentTransmitter(currentTransmitterId?: string) {
        return this.byCurrentTransmitterWithStatus({ declined: true }, currentTransmitterId)
    }

    public async pendingByCurrentTransmitter(currentTransmitterId?: string) {
        return this.byCurrentTransmitterWithStatus({
            accepted      : false,
            declined      : false,
            withoutExpires: true
        }, currentTransmitterId)
    }

    public async expiredByCurrentTransmitter(currentTransmitterId?: string) {
        return this.byCurrentTransmitterWithStatus({
            accepted   : false,
            declined   : false,
            onlyExpired: true
        }, currentTransmitterId)
    }

    public async answer(docId: string, userId: string, accepted: boolean) {
        try {
            const quote = await this.model.whereSnapshot("customer", userId).whereSnapshot("id", docId).get()

            if (quote === null) {
                return Result.forbidden()
            }

            const result = await this.model.update(docId, {
                accepted,
                acceptedAt: accepted ? Model._now() : null,
                declined  : !accepted,
                declinedAt: !accepted ? Model._now() : null,
            })
            if (result.id) {
                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async accept(docId: string, userId: string) {
        return this.answer(docId, userId, true)
    }

    public async decline(docId: string, userId: string) {
        return this.answer(docId, userId, false)
    }

    public async search(query: string) {
        try {
            return Result.success(await this.model.search(query))
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async searchByMemberCurrent(query: string, transmitterId?: string) {
        try {
            return transmitterId ? Result.success(await this.model.searchByMemberAndTransmitterId(query, transmitterId)) : Result.unauthorized()
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

}
