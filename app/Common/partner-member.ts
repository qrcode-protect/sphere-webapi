"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 11/07/2022 at 14:19
 * File app/Common/partner-member
 */


import { Result }       from "@sofiakb/adonis-response";
import Log              from "QRCP/Sphere/Common/Log";
import Partner          from "QRCP/Sphere/Partner/Partner";
import Member           from "QRCP/Sphere/Member/Member";
import { each, uniqBy } from "lodash";

export const findActiveByNumber = async (numberColumn: string, personNumber: string, model: Partner | Member) => {
    try {
        const query = model.whereSnapshot(numberColumn, personNumber)

        return Result.success((await query.get()) || [])
    } catch (e) {
        Log.error(e, true)
        return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
    }
}

export const findActive = async (uniqField: string, model: Partner | Member, activityId?: string) => {
    try {
        const query = model.whereSnapshot("active", true)

        const data = await (activityId ? query.where("activityId", activityId) : query.get()) || []
        return Result.success(uniqBy(data, uniqField))
    } catch (e) {
        Log.error(e, true)
        return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
    }
}

export const updateAll = async (model: Partner | Member, numberColumn: string, docID: string, updatable, force = false) => {
    const dataItem = (await (await model.collection.doc(docID)).get()).data()
    const dataItems = dataItem ? await model.whereSnapshot("id", docID, "!=").where(numberColumn, dataItem[numberColumn]) : null

    const updated = model.updateItem(docID, updatable, force);

    delete updatable.firstname
    delete updatable.lastname
    delete updatable.email
    delete updatable.phone
    delete updatable.id
    delete updatable.uid

    each(dataItems, (item) => model.updateItem(item.id, updatable, force))

    return updated;
}
