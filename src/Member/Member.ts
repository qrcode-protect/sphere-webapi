"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Member/Member
 */

import Model                                       from "QRCP/Sphere/Common/Model";
import MemberAttributes                            from "QRCP/Sphere/Member/MemberAttributes";
import DuplicateEntryException                     from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import { cleanPersonalInformations, personalKeys } from "App/Common";
import { generateNumber, name, stripAccents }      from "App/Common/string";

export default class Member extends Model {
    id: string;
    firstname: string;
    lastname: string;
    username?: string;
    email: string;
    phone: Nullable<string>;
    activityId: string;
    companyName: string;
    certificate: string;
    siret: string;
    active: boolean;
    available: boolean;
    uid?: string;
    premium = false;
    memberNumber: string;
    name: string;


    constructor(attributes?: MemberAttributes) {
        super({ collectionName: "members", model: Member });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data, force = true): Promise<Member> {
        const personalInfo = cleanPersonalInformations({
            firstname: data.firstname,
            lastname : data.lastname,
            username : data.username,
            phone    : data.phone,
            email    : data.email
        })

        personalKeys.forEach((key) => data[key] = personalInfo[key])

        data.name = stripAccents(data.companyName);
        data.name = name(data.name.toLowerCase(), "-");

        if (typeof data.active === "undefined")
            data.active = false;

        if (typeof data.available === "undefined")
            data.available = false;

        if (typeof data.premium === "undefined")
            data.premium = false;

        if (typeof data.memberNumber === "undefined") {
            const parentsMembers = (await this.where("name", data.name))
            data.memberNumber = parentsMembers !== null && parentsMembers[0] ? parentsMembers[0].memberNumber : generateNumber(await this.count(), "ADH");
        }

        if (force && (await this.where("email", data.email)) !== null) {
            throw new DuplicateEntryException()
        }

        return super.store(data);
    }


}
