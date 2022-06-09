"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/Message/Message
 */

import MessageAttributes     from "QRCP/Sphere/_Chat/Message/MessageAttributes";
import Model                 from "QRCP/Sphere/Common/Model";
import { conversationModel } from "App/Common/model";

export default class Message extends Model {
    id: string
    attachment: Nullable<string>
    sender: string
    content: string
    date: Date

    constructor(attributes?: MessageAttributes) {
        super({ collectionName: "messages", model: Message });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data: MessageAttributes): Promise<any> {

        if (typeof data.conversationId === "undefined" || data.conversationId === null)
            return null

        if (typeof data.sender === "undefined" || data.sender === null)
            return null

        const now = Model._now()

        if (typeof data.attachment === "undefined")
            data.attachment = null;

        if (typeof data.date === "undefined")
            data.date = now;

        const batch = this.instance.batch()

        const conversationDocument = (conversationModel()).collection.doc(data.conversationId)
        const messageCollection = (conversationModel()).collection.doc(data.conversationId).collection("messages")


        const message = messageCollection.doc()

        batch.set(message, {
            id        : message.id,
            attachment: data.attachment,
            sender    : data.sender,
            content   : data.content,
            date      : data.date,
            createdAt : now,
            updatedAt : now,
        })

        batch.update(conversationDocument, {
            hasNewMessage: true,
            latestMessage: now
        })

        await batch.commit()

        return await this.casting((await (await messageCollection.doc(message.id)).get()).data());
    }
}
