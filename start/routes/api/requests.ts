"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/requests
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        // Route.get("/paginate", "RequestController.paginate")
        // Route.get("/accepted/paginate", "RequestController.acceptedPaginate")
        // Route.get("/declined/paginate", "RequestController.declinedPaginate")
        // Route.get("/pending/paginate", "RequestController.pendingPaginate")
        // Route.get("/terminated/paginate", "RequestController.terminatedPaginate")
        // Route.get("/denied-by-member/paginate", "RequestController.deniedByMemberPaginate")
    }).middleware("admin")

    Route.group(() => {
        Route.get("/", "RequestController.all")
        Route.get("/accepted", "RequestController.accepted")
        Route.get("/declined", "RequestController.declined")
        Route.get("/pending", "RequestController.pending")
        Route.get("/terminated", "RequestController.terminated")
        Route.get("/denied-by-member", "RequestController.deniedByMember")

        Route.get("/paginate", "RequestController.paginate")
        Route.get("/accepted/paginate", "RequestController.acceptedPaginate")
        Route.get("/declined/paginate", "RequestController.declinedPaginate")
        Route.get("/pending/paginate", "RequestController.pendingPaginate")
        Route.get("/terminated/paginate", "RequestController.terminatedPaginate")
        Route.get("/denied-by-member/paginate", "RequestController.deniedByMemberPaginate")

        Route.post("/accept/:id", "RequestController.accept")
        Route.put("/decline/:id", "RequestController.decline")
    }).middleware("partner")


    // Route.group(() => {
    //     Route.get("/active", "RequestController.active")
    //     Route.get("/inactive", "RequestController.inactive")
    //     Route.get("/:id", "RequestController.findById")
    //
    //     Route.put("/unblock/:id", "RequestController.unblock")
    //     Route.put("/block/:id", "RequestController.block")
    //     Route.put("/validate/:id", "RequestController.validate")
    //     Route.put("/deny/:id", "RequestController.deny")
    //
    //     Route.put("/:id", "RequestController.update")
    //
    //     Route.delete("/:id", "RequestController.destroy")
    //
    //     Route.post("/from-dashboard", "RequestController.storeFromDashboard")
    //     Route.post("/from-dashboard/:id", "RequestController.editFromDashboard")
    // }).middleware("admin")
    //
    // Route.post("", "RequestController.store")
})
    .namespace("QRCP/Sphere/Request")
    .prefix("/requests")
