"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/users
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.get("", "UserController.all")
    Route.get("/dashboard", "UserController.dashboard")

    Route.post("", "UserController.store")

    Route.put("/:id", "UserController.update")
    Route.put("/enable/:id", "UserController.enable")
    Route.put("/disable/:id", "UserController.disable")

    Route.delete("/:id", "UserController.destroy")

})
    .namespace("QRCP/Sphere/User")
    .middleware("admin")
    .prefix("/users")
