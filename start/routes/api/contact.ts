"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 16:37
 * File start/routes/api/activities
 */

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {
    Route.post("", "ContactController.send")
})
    .namespace("QRCP/Sphere/Contact")
    .prefix("/contacts")
