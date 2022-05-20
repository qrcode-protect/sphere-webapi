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

    /****************************
     ******* LOGIN ROUTES *******
     ****************************/
    Route.post("/login", "Login/LoginController.login")

    Route.group(() => {

        /****************************
         ****** USER ROUTES *******
         ****************************/
        Route.get("/user/current", "Auth/AuthController.user")

        /****************************
         ****** ROLES ROUTES *******
         ****************************/
        Route.get("/roles/dashboard", "Auth/AuthController.dashboardRoles")

        /****************************
         ****** LOGGED ROUTES *******
         ****************************/
        Route.get("/logged", "Auth/AuthController.logged")

        /****************************
         ****** LOGOUT ROUTES *******
         ****************************/
        Route.post("/logout", "Auth/AuthController.logout")

    }).middleware("auth")

    /****************************
     ***** PASSWORD ROUTES ******
     ****************************/
    Route.post("/password/forgot", "Password/PasswordController.forgot").as("password.forgot");
    Route.post("/password/reset", "Password/PasswordController.reset").as("password.reset");
    Route.get("/password/reset/:id", "Password/PasswordController.findById").as("password.reset.byID");
    // + password.reset.verify in routes/web.php

})
    .namespace("QRCP/Sphere/Authentication")
    .prefix("/auth")