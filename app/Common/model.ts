"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:57
 * File app/Common/model
 */

import Application from "@ioc:Adonis/Core/Application";
import Activity    from "QRCP/Sphere/Activity/Activity";
import Member      from "QRCP/Sphere/Member/Member";


export const activityModel = (): Activity => Application.container.use("activity.model")
export const memberModel = (): Member => Application.container.use("member.model")
