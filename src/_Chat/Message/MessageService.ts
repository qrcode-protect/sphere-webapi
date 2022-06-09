"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Message/Message
 */

import Service           from "QRCP/Sphere/Common/Service";
import MessageAttributes from "QRCP/Sphere/_Chat/Message/MessageAttributes";
import Message           from "QRCP/Sphere/_Chat/Message/Message";
import { Result }        from "@sofiakb/adonis-response";
import Log               from "QRCP/Sphere/Common/Log";

export default class MessageService extends Service {

    constructor(model = Message) {
        super(model);
    }

    public async store(data: MessageAttributes, senderId: string | null = null) {
        try {
            if (senderId === null) {
                return Result.badRequest("Sender ID is missing.")
            }

            const conversation = await this.model.store({ ...data, sender: senderId })

            return conversation === null ? Result.error() : Result.success(conversation)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

}
