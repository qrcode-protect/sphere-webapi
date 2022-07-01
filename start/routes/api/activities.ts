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

    Route.group(() => {
        // create
        Route.post("", "ActivityController.store")
        // update
        Route.put("/:id", "ActivityController.update")
        // delete
        Route.delete("/:id", "ActivityController.destroy")
    }).middleware("admin")

    Route.get("", "ActivityController.all")
    Route.get("/:id", "ActivityController.findById")

})
    .namespace("QRCP/Sphere/Activity")
    .prefix("/activities")
