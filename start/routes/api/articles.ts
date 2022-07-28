"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 16:37
 * File start/routes/api/articles
 */

import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        // create
        Route.post("", "ArticleController.store")
        // update
        Route.put("/:id", "ArticleController.update")
        // delete
        Route.delete("/:id", "ArticleController.destroy")
    }).middleware("marketing")

    Route.get("", "ArticleController.all")
    Route.get("/by-network/:networkId?", "ArticleController.findByNetworkId")

})
    .namespace("QRCP/Sphere/_Article/Article")
    .prefix("/articles")
