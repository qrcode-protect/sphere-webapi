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
        Route.post("", "QuoteController.store")
    }).middleware("partner")

    Route.group(() => {
        Route.get("/by-current-transmitter/accepted", "QuoteController.acceptedByCurrentTransmitter")
        Route.get("/by-current-transmitter/declined", "QuoteController.declinedByCurrentTransmitter")
        Route.get("/by-current-transmitter/pending", "QuoteController.pendingByCurrentTransmitter")
        Route.get("/by-current-transmitter/expired", "QuoteController.expiredByCurrentTransmitter")


        Route.post("/search/by-partner", "QuoteController.searchByPartner")

    }).middleware("auth")
})
    .namespace("QRCP/Sphere/Quote")
    .prefix("/quotes")
