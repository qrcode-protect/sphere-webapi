"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:44
 * File config/link
 */

import Env from "@ioc:Adonis/Core/Env";

/*type LinkObject = {
    url: string,
    children?: LinkObject
}

type LinkConfig = {
    app: LinkObject,
    dashboard: LinkObject,
    partner: LinkObject,
    website: LinkObject,
}*/

const appUrl = Env.get("APP_URL")
const dashboardUrl = Env.get("DASHBOARD_URL")
const partnerUrl = Env.get("PARTNER_URL")
const websiteUrl = Env.get("WEBSITE_URL")
const resetPasswordUrl = `${websiteUrl}/password/reset`

/*
|--------------------------------------------------------------------------
| Link Config
|--------------------------------------------------------------------------
|
*/
const linkConfig = {
    app      : {
        url     : appUrl
    },
    dashboard: {
        url     : dashboardUrl,
        password: {
            reset: resetPasswordUrl
        }
    },
    partner  : {
        url     : partnerUrl,
        password: {
            reset: resetPasswordUrl
        }
    },
    website  : {
        url     : websiteUrl,
        password: {
            reset: resetPasswordUrl
        }
    },
}

export default linkConfig
