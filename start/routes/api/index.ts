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
    /*******************************
     * Rôles autorisés :
     * * Tous
     ******************************/
    // require("./restaurants")
    /*******************************
     FIN ROLE AUTORISES
     ******************************/
})
    // .namespace("QRCP/Sphere/Http/Controllers")
    .prefix("/api/v1")
    // .middleware("apiKey")
