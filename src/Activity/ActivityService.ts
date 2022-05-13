"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Activity/Activity
 */

import Service          from "QRCP/Sphere/Common/Service";
import ActivityAttributes from "QRCP/Sphere/Activity/ActivityAttributes";
import Activity           from "QRCP/Sphere/Activity/Activity";

export default class ActivityService extends Service {

    constructor(model = Activity) {
        super(model);
    }

    public store = async (data: ActivityAttributes) => super.store(data)

}
