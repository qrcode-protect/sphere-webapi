"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 16:37
 * File start/routes/api/networks
 */

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        // create
        Route.post("", "NetworkController.store")
        // update
        Route.put("/:id", "NetworkController.update")
        // delete
        Route.delete("/:id", "NetworkController.destroy")
    }).middleware("marketing")

    Route.get("", "NetworkController.all")
    Route.get("/seeds", "NetworkController.seeds")

})
    .namespace("QRCP/Sphere/_Network/Network")
    .prefix("/networks")
