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
import User        from "QRCP/Sphere/User/User";
import ApiToken    from "QRCP/Sphere/Authentication/ApiToken/ApiToken";


export const activityModel = (): Activity => Application.container.use("activity.model")
export const memberModel = (): Member => Application.container.use("member.model")
export const userModel = (): User => Application.container.use("user.model")
export const apiTokenModel = (): ApiToken => Application.container.use("auth.apiToken.model")
