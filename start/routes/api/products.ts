"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/quotes
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        Route.get("", "ProductController.all")

        Route.get("/:id", "ProductController.findById")

        Route.post("", "ProductController.store")
        Route.post("/csv/import", "ProductController.importCsv")

        Route.put("/:id", "ProductController.update")

        Route.put("/unblock/:id", "ProductController.unblock")
        Route.put("/block/:id", "ProductController.block")

        Route.delete("/:id", "ProductController.destroy")
    }).middleware("partner")

})
    .namespace("QRCP/Sphere/Product")
    .prefix("/products")
