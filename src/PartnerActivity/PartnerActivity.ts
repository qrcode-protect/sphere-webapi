"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/PartnerActivity/PartnerActivity
 */

import Model             from "QRCP/Sphere/Common/Model";
import PartnerAttributes from "QRCP/Sphere/PartnerActivity/PartnerActivityAttributes";
import { map }           from "lodash";

export default class PartnerActivity extends Model {
    id: string;
    partnerId: string;
    activityId: string;

    constructor(attributes?: PartnerAttributes) {
        super({ collectionName: "partner_activities", model: PartnerActivity });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data): Promise<PartnerActivity> {
        return super.store(data);
    }

    async storeMultiple(activities: string, partnerId: string): Promise<PartnerActivity[]> {

        const values = map(activities, item => ({ partnerId, activityId: item }))

        return await Promise.all(map(values, async (item) => await this.store(item)));
    }

    async updateMultiple(activities: string, partnerId: string): Promise<PartnerActivity[]> {

        const oldActivities = (await this.where("partnerId", partnerId)) as PartnerActivity[];
        await Promise.all(map(oldActivities, async (item) => await this.delete(item.id)));

        const values = map(activities, item => ({ partnerId, activityId: item }))
        return await Promise.all(map(values, async (item) => await this.store(item)));
    }
}
