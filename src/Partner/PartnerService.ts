"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Partner/Partner
 */

import Service                            from "QRCP/Sphere/Common/Service";
import PartnerAttributes                  from "QRCP/Sphere/Partner/PartnerAttributes";
import Partner                            from "QRCP/Sphere/Partner/Partner";
import { MultipartFileContract }          from "@ioc:Adonis/Core/BodyParser";
import { Result }                         from "@sofiakb/adonis-response";
import Log                                from "QRCP/Sphere/Common/Log";
import DuplicateEntryException            from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import UserService                        from "QRCP/Sphere/User/UserService";
import { RoleType }                       from "QRCP/Sphere/Authentication/utils/roles";
import AuthMail                           from "QRCP/Sphere/Authentication/AuthMail";
import User                               from "QRCP/Sphere/User/User";
import { name }                           from "App/Common/string";
import { upload }                         from "App/Common/file";
import { findActive, findActiveByNumber } from "App/Common/partner-member";

interface StorePartnerAttributes extends PartnerAttributes {
    upload?: unknown
}

export default class PartnerService extends Service {

    constructor(model = Partner) {
        super(model);
    }

    public async findActive(activityId?: string) {
        return findActive("partnerNumber", this.model, activityId)
    }

    public async findActiveByNumber(partnerNumber: string) {
        return findActiveByNumber("partnerNumber", partnerNumber, this.model);
    }

    public async store(data: StorePartnerAttributes, documents?: Nullable<{ certificate: Nullable<MultipartFileContract>, avatar: Nullable<MultipartFileContract> }>, fromDashboard = false) {
        delete data.upload

        if (documents) {

            if (documents.certificate)
                data.certificate = await upload(documents.certificate, `partners/certificates/${name(data.companyName, "-")}`)

            if (documents.avatar)
                data.avatar = await upload(documents.avatar, `partners/avatars/${name(data.companyName, "-")}`)
        }

        let result

        try {
            result = await this.model.store(data)
            if (result.id) {
                result = (await this.createUser(result.id, result)).data
                // result.uid = authUser.uid;

                if (fromDashboard) {
                    await this.validate(result.id)
                }

                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                if (result && result.id) {
                    await this.model.delete(result.id)
                }
                return Result.duplicate("Un espace existe déjà avec cette adresse e-mail")
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async createUser(partnerId: string, partner: Partner) {

        try {
            const userService = new UserService()
            const user = (await userService.store({
                id       : partnerId,
                lastname : partner.lastname,
                firstname: partner.firstname,
                email    : partner.email,
                phone    : partner.phone,
                roleType : RoleType.partner
            }, false))
            const authUser = user.data

            if (authUser instanceof User && authUser.uid) {
                await this.model.updateItem(partnerId, { uid: authUser.uid })
                partner.uid = authUser.uid

                if (partnerId !== authUser.uid) {
                    partner = await this.model.store({ ...partner, id: authUser.uid, uid: authUser.uid }, false);
                    await this.model.delete(partnerId);
                }

            } else {
                if (user.code === 419) {
                    await this.model.delete(partnerId);
                    throw new DuplicateEntryException()
                    // const authUser2 = (await userService.findOneBy("email", partner.email)).data
                    // if (authUser2 instanceof User)
                    //     await this.model.update(partnerId, { uid: authUser2.uid })
                }
            }

            return Result.success(partner)
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                throw e
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async validate(docID: string) {
        try {
            const result = await this.model.update(docID, { active: true, available: true })
            if (result.id) {
                const user = (await (new UserService()).enableWithUid(result.uid)).data

                if (user instanceof User) {
                    await AuthMail.register(user, "partner")
                }

                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate()
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async deny(docID: string) {
        return this.destroy(docID)
    }

    async destroy(docID: string) {
        try {
            const partner: Partner | null = await this.model.doc(docID)

            if (partner && partner.uid && partner.uid.trim() !== "") {
                await (new UserService()).destroyByUid(partner.uid)
            }

            if (partner === null)
                throw new Error(`Partner "${docID} not found`)

            return Result.success(await this.model.delete(docID))
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${docID} demandée n'existe pas.`)
        }
    }

}
