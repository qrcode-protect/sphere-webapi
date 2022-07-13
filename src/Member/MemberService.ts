"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Member/Member
 */

import Service                            from "QRCP/Sphere/Common/Service";
import MemberAttributes                   from "QRCP/Sphere/Member/MemberAttributes";
import Member                             from "QRCP/Sphere/Member/Member";
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
import { uniqBy }                         from "lodash";
import { findActive, findActiveByNumber } from "App/Common/partner-member";

interface StoreMemberAttributes extends MemberAttributes {
    upload?: unknown
}

export default class MemberService extends Service {

    constructor(model = Member) {
        super(model);
    }

    async all(force = true) {

        const members = await this.model.all();

        if (force) {
            return Result.success(members);
        }
        return Result.success(uniqBy(members, "memberNumber"))

    }

    public async store(data: StoreMemberAttributes, certificate?: Nullable<MultipartFileContract>, fromDashboard = false) {
        delete data.upload

        if (certificate)
            data.certificate = await upload(certificate, `members/certificates/${name(data.companyName, "-")}`)

        /*if (certificate) {
            const certificateFilename = `${moment().unix()}.${certificate.extname}`;
            const certificatePath: string = Drive.disks.uploads.root
            const certificateFullPath: string = path.resolve(Drive.disks.uploads.root, certificateFilename)
            const destinationPath = `members/certificates/${name(data.companyName, "-")}/${certificateFilename}`
            await certificate.move(certificatePath, { name: certificateFilename })

            const bucket: Bucket = <Bucket>Application.container.use("firebase.storage")

            await bucket.upload(certificateFullPath, {
                destination: destinationPath,
            });

            await bucket.file(destinationPath)
                .getSignedUrl({ action: "read", expires: "01-01-2491" })
                .then((signedUrl: GetSignedUrlResponse) => data.certificate = signedUrl[0])
                .catch(() => data.certificate = data.certificate = `https://firebasestorage.googleapis.com/v0/b/${Config.get("firebase.projectId")}.appspot.com/o/${encodeURIComponent(destinationPath)}?alt=media`)


        }*/

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
                return Result.duplicate("Un espace existe déjà avec cette adresse e-mail")
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    public async createUser(memberId: string, member: Member) {

        try {
            const userService = new UserService()
            const user = (await userService.store({
                id       : memberId,
                lastname : member.lastname,
                firstname: member.firstname,
                email    : member.email,
                phone    : member.phone,
                roleType : RoleType.member
            }, false))
            const authUser = user.data

            if (authUser instanceof User && authUser.uid) {
                await this.model.update(memberId, { uid: authUser.uid })
                member.uid = authUser.uid

                if (memberId !== authUser.uid) {
                    member = await this.model.store({ ...member, id: authUser.uid, uid: authUser.uid }, false);
                    await this.model.delete(memberId);
                }
            } else {
                if (user.code === 419) {
                    await this.model.delete(memberId);
                    throw new DuplicateEntryException()
                    // const authUser2 = (await userService.findOneBy("email", member.email)).data
                    // if (authUser2 instanceof User)
                    //     await this.model.update(memberId, { uid: authUser2.uid })
                }
            }

            return Result.success(member)
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
                    await AuthMail.register(user, "website")
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
            const member: Member | null = await this.model.doc(docID)

            if (member && member.uid && member.uid.trim() !== "") {
                await (new UserService()).destroyByUid(member.uid)
            }

            if (member === null)
                throw new Error(`Member "${docID} not found`)

            return Result.success(await this.model.delete(docID))
        } catch (e) {
            Log.error(e, true)
            return Result.notFound(`La ressource #${docID} demandée n'existe pas.`)
        }
    }

    public async findActive(activityId?: string) {
        return findActive("memberNumber", this.model, activityId)
    }

    public async findActiveByNumber(memberNumber: string) {
        return findActiveByNumber("memberNumber", memberNumber, this.model);
    }

    public async premiumByEmail(email: string) {
        try {
            const data = await this.model.whereSnapshot("premium", true)
                .whereSnapshot("email", email, ">=")
                .where("email", email + "\uf8ff", "<=") || []
            return Result.success(data)
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

    public async byEmail(email: string) {
        try {
            const data = await this.model.whereSnapshot("email", email, ">=")
                .whereSnapshot("email", email + "\uf8ff", "<=")
                .orderBy("createdAt")
                .get() || []
            return Result.success(uniqBy(data, "memberNumber"))
        } catch (e) {
            Log.error(e, true)
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }
    }

}
