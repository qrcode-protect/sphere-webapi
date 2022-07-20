"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Conversation/Conversation
 */

import Service                                    from "QRCP/Sphere/Common/Service";
import Conversation                               from "QRCP/Sphere/_Chat/Conversation/Conversation";
import { Error as SofiakbError, Result, Success } from "@sofiakb/adonis-response";
import Log                                        from "QRCP/Sphere/Common/Log";
import ConversationAttributes                     from "QRCP/Sphere/_Chat/Conversation/ConversationAttributes";
import { memberModel, partnerModel }              from "App/Common/model";
import { map }                                    from "lodash";

export default class ConversationService extends Service {

    constructor(model = Conversation) {
        super(model);
    }

    public async store(data: ConversationAttributes, senderId: string | null = null) {
        try {
            if (senderId === null) {
                return Result.badRequest("Le créateur de la conversation est manquant.")
            }

            const conversation = await this.model.store({ ...data, userCreator: senderId })

            return conversation === null ? Result.error() : Result.success(conversation)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async history(): Promise<Success | SofiakbError> {
        try {
            const data = await this.model.all() ?? []

            const result = await Promise.all(map(data, async (item) => {
                item.partner = await partnerModel().whereSnapshot("id", item.users, "in").limit(1).first()
                item.member = await memberModel().whereSnapshot("id", item.users, "in").limit(1).first()
                return item
            }))

            return Result.success(result)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async historyByConversationId(conversationId: string): Promise<Success | SofiakbError> {
        try {
            const data = await this.model.where("id", conversationId) ?? []

            const result = await Promise.all(map(data, async (item) => {
                await item.withPartner()
                await item.withMember()
                await item.withMessages()
                /*item.partner = await partnerModel().whereSnapshot("id", item.users, "in").limit(1).first()
                item.member = await memberModel().whereSnapshot("id", item.users, "in").limit(1).first()*/
                return item
            }))

            return Result.success(result)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

}
