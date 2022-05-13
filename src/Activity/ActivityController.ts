"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/Activity/ActivityController
 */

import Controller      from "QRCP/Sphere/Common/Controller";
import ActivityService from "QRCP/Sphere/Activity/ActivityService";


export default class ActivityController extends Controller {

    protected service: ActivityService

    constructor() {
        super(new ActivityService())
    }
}
