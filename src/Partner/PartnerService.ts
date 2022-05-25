"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Partner/Partner
 */

import Service                          from "QRCP/Sphere/Common/Service";
import PartnerAttributes                from "QRCP/Sphere/Partner/PartnerAttributes";
import Partner                          from "QRCP/Sphere/Partner/Partner";
import { MultipartFileContract }        from "@ioc:Adonis/Core/BodyParser";
import Drive                            from "../../config/drive";
import path                             from "path";
import Application                      from "@ioc:Adonis/Core/Application";
import { Bucket, GetSignedUrlResponse } from "@google-cloud/storage";
import { Result }                       from "@sofiakb/adonis-response";
import Log                              from "QRCP/Sphere/Common/Log";
import DuplicateEntryException          from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import Config                           from "@ioc:Adonis/Core/Config";
import UserService                      from "QRCP/Sphere/User/UserService";
import { RoleType }                     from "QRCP/Sphere/Authentication/utils/roles";
import AuthMail                         from "QRCP/Sphere/Authentication/AuthMail";
import User                             from "QRCP/Sphere/User/User";
import moment                           from "moment";
import { name }                         from "App/Common/string";

interface StorePartnerAttributes extends PartnerAttributes {
    upload?: unknown
}

export default class PartnerService extends Service {

    constructor(model = Partner) {
        super(model);
    }

    public async findActive(activityId?: string) {
        try {
            const query = this.model.whereSnapshot("active", true)

            const data = await (activityId ? query.where("activityId", activityId) : query.get()) || []
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async store(data: StorePartnerAttributes, certificate?: Nullable<MultipartFileContract>, fromDashboard = false) {
        delete data.upload

        if (certificate) {
            const certificateFilename = `${moment().unix()}.${certificate.extname}`;
            const certificatePath: string = Drive.disks.uploads.root
            const certificateFullPath: string = path.resolve(Drive.disks.uploads.root, certificateFilename)
            const destinationPath = `partners/certificates/${name(data.companyName, "-")}/${certificateFilename}`
            await certificate.move(certificatePath, { name: certificateFilename })

            const bucket: Bucket = <Bucket>Application.container.use("firebase.storage")

            await bucket.upload(certificateFullPath, {
                destination: destinationPath,
            });

            await bucket.file(destinationPath)
                .getSignedUrl({ action: "read", expires: "01-01-2491" })
                .then((signedUrl: GetSignedUrlResponse) => data.certificate = signedUrl[0])
                .catch(() => data.certificate = data.certificate = `https://firebasestorage.googleapis.com/v0/b/${Config.get("firebase.projectId")}.appspot.com/o/${encodeURIComponent(destinationPath)}?alt=media`)


        }

        try {
            const result = await this.model.store(data)
            if (result.id) {
                await this.createUser(result.id, result)

                if (fromDashboard) {
                    await this.validate(result.id)
                }

                return Result.success(result)
            }
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate("Un espace partenaire existe déjà avec cette adresse e-mail")
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async createUser(partnerId: string, partner: Partner) {

        try {
            const userService = new UserService()
            const user = (await userService.store({
                lastname : partner.lastname,
                firstname: partner.firstname,
                email    : partner.email,
                phone    : partner.phone,
                roleType : RoleType.partner
            }, false))
            const authUser = user.data

            if (authUser instanceof User && authUser.uid) {
                await this.model.update(partnerId, { uid: authUser.uid })
            } else {
                if (user.code === 419) {
                    const authUser2 = (await userService.findOneBy("email", partner.email)).data
                    if (authUser2 instanceof User)
                        await this.model.update(partnerId, { uid: authUser2.uid })
                }
            }

            return Result.success(authUser)
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate()
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

            /*if (partner && partner.uid && partner.uid.trim() !== "") {
                await (new UserService()).destroyByUid(partner.uid)
            }*/

            if (partner === null)
                throw new Error(`Partner "${docID} not found`)

            return Result.success(await this.model.delete(docID))
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${docID} demandée n'existe pas.`)
        }
    }

}
