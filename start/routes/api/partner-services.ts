"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/quotes
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        Route.get("", "PartnerServiceController.all")

        Route.get("/:id", "PartnerServiceController.findById")

        Route.post("", "PartnerServiceController.store")

        Route.put("/:id", "PartnerServiceController.update")

        Route.put("/unblock/:id", "PartnerServiceController.unblock")
        Route.put("/block/:id", "PartnerServiceController.block")

        Route.delete("/:id", "PartnerServiceController.destroy")
    }).middleware("partner")

})
    .namespace("QRCP/Sphere/PartnerService")
    .prefix("/partner-services")
