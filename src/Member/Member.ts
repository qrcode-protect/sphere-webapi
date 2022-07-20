"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Member/Member
 */

import Model                                           from "QRCP/Sphere/Common/Model";
import MemberAttributes                                from "QRCP/Sphere/Member/MemberAttributes";
import DuplicateEntryException                         from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import { cleanPersonalInformations, personalKeys }     from "App/Common";
import { generateNumber, stripAccents, withoutSpaces } from "App/Common/string";
import { updateAll }                                   from "App/Common/partner-member";
import { concat, uniqBy }                              from "lodash";

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

    async store(data, force = true): Promise<Member> {
        const personalInfo = cleanPersonalInformations({
            firstname: data.firstname,
            lastname : data.lastname,
            username : data.username,
            phone    : data.phone,
            email    : data.email
        })

        personalKeys.forEach((key) => data[key] = personalInfo[key])

        data.name = stripAccents(data.siret);
        data.name = "member-" + withoutSpaces(data.name.toLowerCase(), "-");

        const parentsMembers = (await this.whereSnapshot("name", data.name).orderBy("id").orderBy("createdAt").get())
        let parentMember

        if (parentsMembers !== null && parentsMembers[0]) {
            parentMember = parentsMembers[0]
            data.memberNumber = parentMember.memberNumber ?? data.memberNumber;
            data.activityId = parentMember.activityId ?? data.activityId
            // data.active = parentMember.active ?? data.active
            // data.available = parentMember.available ?? data.available
            // data.avatar = parentMember.avatar ?? data.avatar
            data.certificate = parentMember.certificate ?? data.certificate
            data.companyName = parentMember.companyName ?? data.companyName
            // data.description = parentMember.description ?? data.description
            data.siret = parentMember.siret ?? data.siret
        }

        if (typeof data.active === "undefined")
            data.active = false;

        if (typeof data.available === "undefined")
            data.available = false;

        if (typeof data.premium === "undefined")
            data.premium = false;

        if (typeof data.memberNumber === "undefined") {
            data.memberNumber = generateNumber(data.siret, "ADH");
        }

        if (force && (await this.where("email", data.email)) !== null) {
            throw new DuplicateEntryException()
        }

        return super.store(data);
    }

    async update(docID: string, data, force = false): Promise<any> {
        return updateAll(this, "memberNumber", docID, data, force);
    }

    async updateItem(docID: string, data, force = false): Promise<any> {
        return super.update(docID, data, force)
    }

}
