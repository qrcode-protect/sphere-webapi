"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Partner/Partner
 */

import Model                                           from "QRCP/Sphere/Common/Model";
import PartnerAttributes                               from "QRCP/Sphere/Partner/PartnerAttributes";
import DuplicateEntryException                         from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import { cleanPersonalInformations, personalKeys }     from "App/Common";
import { generateNumber, stripAccents, withoutSpaces } from "App/Common/string";
import { updateAll }                                   from "App/Common/partner-member";
import PartnerActivity    from "QRCP/Sphere/PartnerActivity/PartnerActivity";
import { concat, uniqBy } from "lodash";

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

    async search(query: string) {
        const byEmail = await this.searchByEmail(query)
        const bySiret = await this.searchBySiret(query)

        return uniqBy(concat(bySiret, byEmail), "id")
    }

    async searchByField(column: string, value: string) {
        return (await this.searchBy(column, value, 10).get()) || []
    }

    async searchByEmail(email: string) {
        return this.searchByField("email", email)
    }

    async searchBySiret(siret: string) {
        return this.searchByField("siret", siret)
    }

    async parentBy(column: string, value: string) {
        const partners = await this.whereSnapshot(column, value).orderBy("id").orderBy("createdAt").get()
        return partners ? partners[0] : null
    }

    async parentByName(partnerName: string) {
        return await this.parentBy("name", partnerName)
    }

    async parentByNumber(partnerNumber: string) {
        return await this.parentBy("partnerNumber", partnerNumber)
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

        data.name = stripAccents(data.siret);
        data.name = "partner-" + withoutSpaces(data.name.toLowerCase(), "-");

        const parentPartner = await this.parentByName(data.name)

        if (parentPartner !== null) {
            data.partnerNumber = parentPartner.partnerNumber ?? data.partnerNumber;
            data.activities = parentPartner.activities ?? data.activities
            data.activityId = parentPartner.activityId ?? data.activityId
            // data.active = parentPartner.active ?? data.active
            // data.available = parentPartner.available ?? data.available
            data.avatar = parentPartner.avatar ?? data.avatar
            data.certificate = parentPartner.certificate ?? data.certificate
            data.companyName = parentPartner.companyName ?? data.companyName
            data.description = parentPartner.description ?? data.description
            data.siret = parentPartner.siret ?? data.siret
        }

        if (typeof data.active === "undefined")
            data.active = false;

        if (typeof data.available === "undefined")
            data.available = false;

        if (typeof data.partnerNumber === "undefined") {
            data.partnerNumber = generateNumber(data.siret, "PRT");
        }
        // data.partnerNumber = generateNumber(data.lastname, data.phone, "PRT");

        if (typeof data.activities === "string")
            data.activities = data.activities.toString().split(",");
        else if (typeof data.activities === "undefined" || data.activities === null)
            data.activities = [];

        if (force && (await this.where("email", data.email)) !== null) {
            throw new DuplicateEntryException()
        }

        data.id = this.collection.doc().id

        await (new PartnerActivity()).storeMultiple(data.activities, data.id);

        return super.store(data);
    }

    async update(docID: string, data, force = false): Promise<any> {
        return updateAll(this, "partnerNumber", docID, data, force);
    }

    async updateItem(docID: string, data, force = false): Promise<any> {
        const result = super.update(docID, data, force)

        if (data.activities) {
            await (new PartnerActivity()).updateMultiple(data.activities, docID)
        }

        return result
    }

}
