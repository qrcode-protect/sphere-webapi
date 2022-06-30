"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/Activity/Activity
 */

import Model              from "QRCP/Sphere/Common/Model";
import ActivityAttributes from "QRCP/Sphere/Activity/ActivityAttributes";
import moment             from "moment";
import { each, map }      from "lodash";

export default class Activity extends Model {
    id: string;
    name?: Nullable<string> = null;
    label: string;
    activities?: Activity[]


    constructor(attributes?: ActivityAttributes) {
        super({ collectionName: "activities", model: Activity });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async casting(data): Promise<any> {
        const documentsRefs = await this.collection.doc(data.id).collection("activities").orderBy("id", "asc").get();

        const activities: any[] = [];
        for (const documentSnapshot of documentsRefs.docs) {
            activities.push(await (new Activity()).casting(documentSnapshot.data()));
        }

        const activityData = { ...data, activities }

        return super.casting(activityData);
    }

    public async all(): Promise<any[]> {
        return (await super.orderBy("label").get()) ?? [];
    }

    public async store(data: Activity) {
        if (!data.name) {
            data.name = [ data.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(RegExp(/ +/g), "-"), moment().unix() ].join("-")
        }

        const batch = this.instance.batch()

        const activity = this.collection.doc()

        batch.set(activity, {
            id       : activity.id,
            name     : data.name,
            label    : data.label.toLowerCase(),
            createdAt: Model._now(),
            updatedAt: Model._now(),
        })

        each(data.activities, item => {
            const subActivity = activity.collection("activities").doc()
            if (item.label && item.label.trim() !== "")
                batch.set(subActivity, {
                    id       : subActivity.id,
                    name     : [ item.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(RegExp(/ +/g), "-"), moment().unix() ].join("-"),
                    label    : item.label.toLowerCase(),
                    createdAt: Model._now(),
                    updatedAt: Model._now(),
                })
        })

        await batch.commit()

        return await this.casting((await (await this.collection.doc(activity.id)).get()).data());
    }

    async update(docID: string, updatable: ActivityAttributes): Promise<any> {
        if (docID.trim() === "")
            return null;

        const batch = this.instance.batch()

        const activity = this.collection.doc(docID)

        const activities = updatable.activities ?? []
        delete updatable.activities
        delete updatable.createdAt

        updatable.label = updatable.label?.toLowerCase()

        batch.update(activity, { ...updatable, ...{ updatedAt: Model._now() } })

        await Promise.all(map(activities, async (item) => {
            const subActivity = item.id ? activity.collection("activities").doc(item.id) : activity.collection("activities").doc()
            const subActivityData = ((await subActivity.get()).data())
            if (item.label && item.label.trim() !== "")
                batch.set(subActivity, {
                    id       : subActivity.id,
                    name     : item.name ?? [ item.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(RegExp(/ +/g), "-"), moment().unix() ].join("-"),
                    label    : item.label.toLowerCase(),
                    createdAt: subActivityData?.createdAt ?? Model._now(),
                    updatedAt: Model._now(),
                })
            else if (subActivityData) {
                batch.delete(subActivity)
            }
        }))

        await batch.commit()

        return await this.casting((await (await this.collection.doc(activity.id)).get()).data());
    }
}
