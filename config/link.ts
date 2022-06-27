"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:44
 * File config/link
 */

import Env                      from "@ioc:Adonis/Core/Env";
import { urlSingleBackslashes } from "App/Common/string";

type LinkObject = {
    url: string,
    password?: { reset: string }
    login?: string
}

type LinkConfig = {
    app: LinkObject,
    dashboard: LinkObject,
    partner: LinkObject,
    website: LinkObject,
    webapp: LinkObject,
}

const appUrl = Env.get("APP_URL")
const dashboardUrl = Env.get("DASHBOARD_URL")
const partnerUrl = Env.get("PARTNER_URL")
const websiteUrl = Env.get("WEBSITE_URL")
const webappUrl = Env.get("WEBAPP_URL")
const resetPasswordUrl = `${websiteUrl}/password/reset`

const loginUrl = (baseUrl: string) => urlSingleBackslashes(`${baseUrl}/login`)

/*
|--------------------------------------------------------------------------
| Link Config
|--------------------------------------------------------------------------
|
*/
const linkConfig: LinkConfig = {
    app      : {
        url: appUrl
    },
    dashboard: {
        url     : dashboardUrl,
        login   : loginUrl(dashboardUrl),
        password: {
            reset: resetPasswordUrl
        }
    },
    partner  : {
        url     : partnerUrl,
        login   : loginUrl(partnerUrl),
        password: {
            reset: resetPasswordUrl
        }
    },
    website  : {
        url     : websiteUrl,
        login   : loginUrl(websiteUrl),
        password: {
            reset: resetPasswordUrl
        }
    },
    webapp   : {
        url  : webappUrl,
        login: webappUrl,
    },
}

export default linkConfig
