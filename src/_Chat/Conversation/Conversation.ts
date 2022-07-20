"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/Conversation/Conversation
 */

import Model                                       from "QRCP/Sphere/Common/Model";
import ConversationAttributes                      from "QRCP/Sphere/_Chat/Conversation/ConversationAttributes";
import { map, uniq }                               from "lodash";
import { memberModel, messageModel, partnerModel } from "App/Common/model";
import Partner                                     from "QRCP/Sphere/Partner/Partner";
import Member                                      from "QRCP/Sphere/Member/Member";
import Message                                     from "QRCP/Sphere/_Chat/Message/Message";

export default class Conversation extends Model {

    id: string
    date: Date
    hasNewMessage: boolean
    latestMessage: Nullable<Date>
    users: string[]
    partner?: Partner
    member?: Member
    messages?: Message[]

    constructor(attributes?: ConversationAttributes) {
        super({ collectionName: "conversations", model: Conversation });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data: ConversationAttributes): Promise<any> {

        if (typeof data.userCreator === "undefined" || data.userCreator === null)
            return null

        const now = Model._now()

        if (typeof data.hasNewMessage === "undefined")
            data.hasNewMessage = false;

        if (typeof data.date === "undefined")
            data.date = now;

        if (typeof data.latestMessage === "undefined")
            data.latestMessage = now;

        data.users = uniq(data.users.concat([ data.userCreator ]))
        data.users.sort()

        const conversationId = data.users.join("--")

        const batch = this.instance.batch()

        const conversation = this.collection.doc(conversationId)

        batch.set(conversation, {
            id           : conversation.id,
            date         : data.date,
            hasNewMessage: data.hasNewMessage,
            latestMessage: data.latestMessage,
            users        : data.users,
            createdAt    : now,
            updatedAt    : now,
        })
        await batch.commit()

        const message = conversation.collection("messages").doc()

        await messageModel().store({
            id            : message.id,
            attachment    : null,
            attachmentId  : null,
            sender        : data.userCreator,
            content       : "Nouvelle conversation",
            date          : now,
            conversationId: conversation.id,
            automatic     : true
        })

        return await this.casting((await (await this.collection.doc(conversation.id)).get()).data());
    }

    async updateMessage(docID: string, messageId: string, data, force= false): Promise<any> {
        return super.update(`${docID}/${messageModel().collection.path}/${messageId}`, data, force);
    }

    async withPartner() {
        this.partner = await partnerModel().whereSnapshot("id", this.users, "in").limit(1).first()
    }

    async withMember() {
        this.member = await memberModel().whereSnapshot("id", this.users, "in").limit(1).first()
    }

    async withMessages() {
        const messages = (await (await this.collection.doc(this.id).collection("messages")).listDocuments())
        console.log(this.id, messages)
        this.messages = await Promise.all(map(messages, async (message) => messageModel().casting((await message.get()).data(), this.id)))
    }
}
