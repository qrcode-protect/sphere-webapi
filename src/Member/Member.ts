"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Member/Member
 */

import Model                      from "QRCP/Sphere/Common/Model";
import MemberAttributes           from "QRCP/Sphere/Member/MemberAttributes";
import { lower, name, normalize } from "App/Common/string";
import PhoneCleaner               from "App/Common/phone-cleaner";
import DuplicateEntryException    from "QRCP/Sphere/Exceptions/DuplicateEntryException";

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


    constructor(attributes?: MemberAttributes) {
        super({ collectionName: "members", model: Member });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data): Promise<Member> {
        const names: string[] = [
            "lastname",
            "firstname",
        ]

        const lowers: string[] = [
            "email",
        ]

        names.forEach(item => data[item] = name(data[item]))
        lowers.forEach(item => data[item] = lower(data[item]))

        data.username = normalize(`${data.firstname[0]}${data.lastname}`)?.replace(RegExp(/-/g), "")

        if (data.phone)
            data.phone = (new PhoneCleaner(data.phone)).number || null

        if (typeof data.active === "undefined")
            data.active = false;

        if (typeof data.available === "undefined")
            data.available = false;

        if ((await this.where("email", data.email)) !== null) {
            throw new DuplicateEntryException()
        }

        return super.store(data);
    }


}
