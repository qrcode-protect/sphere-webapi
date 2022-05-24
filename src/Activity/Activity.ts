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

export default class Activity extends Model {
    id: string;
    name?: Nullable<string> = null;
    label: string;


    constructor(attributes?: ActivityAttributes) {
        super({ collectionName: "activities", model: Activity });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    public async store(data: Activity) {
        if (!data.name) {
            data.name = data.label.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(RegExp(/ +/g), "-")
        }

        return await super.store(data);
    }

}
