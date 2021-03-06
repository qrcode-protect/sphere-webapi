"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 14:07
 * File start/routes/api/partners
 */


import Route from "@ioc:Adonis/Core/Route";

Route.group(() => {

    Route.group(() => {
        Route.post("", "MessageController.store")
    })
        .namespace("QRCP/Sphere/_Chat/Message")
        .prefix("/messages")

    Route.group(() => {
        Route.post("", "ConversationController.store")
    })
        .namespace("QRCP/Sphere/_Chat/Conversation")
        .prefix("/conversations")
})
    .middleware("auth")
    .prefix("/chat")


Route.group(() => {
    Route.get("/history", "ConversationController.history")
    Route.get("/history/:conversationId", "ConversationController.historyByConversationId")
})
    .namespace("QRCP/Sphere/_Chat/Conversation")
    .middleware("admin")
    .prefix("/conversations")
