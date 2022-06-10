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
import Conversation                                    from "QRCP/Sphere/_Chat/Conversation/Conversation";
import { Result, Success, Error as SofiakbError } from "@sofiakb/adonis-response";
import Log                                        from "QRCP/Sphere/Common/Log";
import ConversationAttributes                     from "QRCP/Sphere/_Chat/Conversation/ConversationAttributes";

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

    public async findByNetworkId(networkId?: string): Promise<Success | SofiakbError> {
        try {
            const data = await this.model.findByNetworkId(networkId) ?? []
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

}
