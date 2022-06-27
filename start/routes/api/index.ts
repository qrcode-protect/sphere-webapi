"use strict"

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@gmail.com>
 *
 * Created by WebStorm on 04/05/2022 at 10:15
 * File start/routes/api
 */

import Route from "@ioc:Adonis/Core/Route"

Route.group(() => {
    require("./auth")

    /*******************************
     * Rôles autorisés :
     * * Tous
     ******************************/
    require("./members")
    require("./partners")
    require("./activities")
    require("./articles")
    require("./networks")
    require("./users")
    require("./chat")
    require("./quotes")
    /*******************************
     FIN ROLE AUTORISES
     ******************************/
})
    // .namespace("QRCP/Sphere/Http/Controllers")
    .prefix("/api/v1")
    // .middleware("apiKey")

