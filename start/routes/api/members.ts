"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/members
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        Route.get("", "MemberController.all")
        Route.get("/active/:activityId?", "MemberController.active")
        Route.get("/inactive", "MemberController.inactive")
        Route.get("/premium", "MemberController.premium")

        Route.put("/validate/:id", "MemberController.validate")
        Route.put("/deny/:id", "MemberController.deny")
        Route.put("/:id", "MemberController.update")

        Route.delete("/:id", "MemberController.destroy")
    }).middleware("admin")

    Route.post("", "MemberController.store")
})
    .namespace("QRCP/Sphere/Member")
    .prefix("/members")
