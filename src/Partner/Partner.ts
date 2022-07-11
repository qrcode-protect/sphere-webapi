"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Partner/Partner
 */

import Model                                       from "QRCP/Sphere/Common/Model";
import PartnerAttributes                           from "QRCP/Sphere/Partner/PartnerAttributes";
import DuplicateEntryException                     from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import { cleanPersonalInformations, personalKeys } from "App/Common";
import { generateNumber, name, stripAccents }      from "App/Common/string";

export default class Partner extends Model {
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
    partnerNumber: string;
    avatar: string;
    name: string;
    description: string;


    constructor(attributes?: PartnerAttributes) {
        super({ collectionName: "partners", model: Partner });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }

    async store(data, force = true): Promise<Partner> {
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

        if (typeof data.partnerNumber === "undefined") {
            const parentsPartners = (await this.where("name", data.name))
            data.partnerNumber = parentsPartners !== null && parentsPartners[0] ? parentsPartners[0].partnerNumber : generateNumber(await this.count(), "PRT");
        }
        // data.partnerNumber = generateNumber(data.lastname, data.phone, "PRT");

        if (typeof data.activities === "string")
            data.activities = data.activities.toString().split(",");
        else if (typeof data.activities === "undefined" || data.activities === null)
            data.activities = [];

        if (force && (await this.where("email", data.email)) !== null) {
            throw new DuplicateEntryException()
        }

        return super.store(data);
    }


}
