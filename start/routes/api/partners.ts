"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/partners
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        Route.get("", "PartnerController.all")
        Route.get("/active/by-number/:partnerNumber?", "PartnerController.activeByNumber")
        Route.get("/active/:activityId?", "PartnerController.active")
        Route.get("/inactive", "PartnerController.inactive")
        Route.get("/group-by/:group", "PartnerController.groupBy")

        Route.put("/validate/:id", "PartnerController.validate")
        Route.put("/deny/:id", "PartnerController.deny")
        Route.put("/:id", "PartnerController.update")



        Route.delete("/:id", "PartnerController.destroy")
    }).middleware("admin")

    Route.post("", "PartnerController.store")
    Route.post("from-dashboard", "PartnerController.storeFromDashboard")
})
    .namespace("QRCP/Sphere/Partner")
    .prefix("/partners")
