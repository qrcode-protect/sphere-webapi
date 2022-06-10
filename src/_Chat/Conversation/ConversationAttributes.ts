"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 11:38
 * File src/Article/ArticleAttributes
 */

export default interface ConversationAttributes {
    id?: string
    date?: Date
    hasNewMessage?: boolean
    latestMessage?: Nullable<Date>
    users: string[],
    userCreator: string,
}
