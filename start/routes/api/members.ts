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

    Route.get("", "MemberController.all")
    // Route.get("/:id", "RestaurantController.findById")

    Route.post("", "MemberController.store")
})
    .namespace("QRCP/Sphere/Member")
    .prefix("/members")
