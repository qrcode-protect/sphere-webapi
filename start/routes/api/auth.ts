"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/auth
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.post("/login", "Login/LoginController.login")

    Route.group(() => {
        Route.get("/logged", "Auth/AuthController.logged")
        Route.post("/logout", "Auth/AuthController.logout")
    }).middleware("auth")

})
    .namespace("QRCP/Sphere/Authentication")
    .prefix("/auth")
