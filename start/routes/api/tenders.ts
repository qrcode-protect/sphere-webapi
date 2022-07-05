"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/tenders
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        Route.get("/", "TenderController.all")
    }).middleware("auth")

    Route.group(() => {
        Route.put("/unblock/:id", "TenderController.unblock")
        Route.put("/block/:id", "TenderController.block")
        Route.put("/validate/:id", "TenderController.validate")
        Route.put("/deny/:id", "TenderController.deny")
    }).middleware("admin")

    Route.post("", "TenderController.store")
})
    .namespace("QRCP/Sphere/Tender")
    .prefix("/tenders")
