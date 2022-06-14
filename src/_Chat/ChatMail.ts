"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 14/06/2022 at 09:32
 * File src/_Chat/ChatMail
 */

import Mail                 from "QRCP/Sphere/Mail/Mail";
import User                 from "QRCP/Sphere/User/User";
import { capitalize, each } from "lodash";

export default class ChatMail extends Mail {
    /**
     * @return bool
     * @throws GuzzleException
     * @param sender
     * @param recipients
     */
    public static async notification(sender: User, recipients: User[]) {

        each(recipients, async (recipient: User) => {
            await Mail.send(recipient.email, "Nouveau message SPHÈRE !", "chat-notification", {
                // await Mail.send("sofiane.akbly@qrcode-protect.com", "Bienvenue chez SPHÈRE !", "member/welcome", {
                user  : { firstname: `${capitalize(recipient.firstname)}` },
                sender: { fullName: `${capitalize(sender.firstname)} ${capitalize(sender.lastname)}` },
                // url   : link,
            })
        })

    }
}
