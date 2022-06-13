"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Partner/PartnerAttributes
 */

export default interface QuoteAttributes {
    id: string
    transmitter: string
    customer: string
    amount: number
    accepted: boolean
    declined: boolean
    acceptedAt: Date
    declinedAt: Date
    file: string
    conversationId: string
    messageId: string
}
