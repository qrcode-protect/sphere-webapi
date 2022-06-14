"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Message/MessageAttributes
 */

export default interface MessageAttributes {
    id?: string
    attachment?: Nullable<string>
    attachmentId?: Nullable<string>
    sender?: string
    content: string
    date?: Date
    conversationId?: string,
    automatic?: boolean
}
