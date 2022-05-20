"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Member/Member
 */

import Service                   from "QRCP/Sphere/Common/Service";
import MemberAttributes          from "QRCP/Sphere/Member/MemberAttributes";
import Member                    from "QRCP/Sphere/Member/Member";
import { MultipartFileContract } from "@ioc:Adonis/Core/BodyParser";
import Drive                     from "../../config/drive";
import path                      from "path";
import Application               from "@ioc:Adonis/Core/Application";
import { Bucket }                from "@google-cloud/storage";
import { Result }                from "@sofiakb/adonis-response";
import Log                       from "QRCP/Sphere/Common/Log";
import DuplicateEntryException   from "QRCP/Sphere/Exceptions/DuplicateEntryException";
import Config                    from "@ioc:Adonis/Core/Config";
import UserService               from "QRCP/Sphere/User/UserService";
import { RoleType }              from "QRCP/Sphere/Authentication/utils/roles";
import AuthMail                  from "QRCP/Sphere/Authentication/AuthMail";
import User                      from "QRCP/Sphere/User/User";

interface StoreMemberAttributes extends MemberAttributes {
    upload?: unknown
}

export default class MemberService extends Service {

    constructor(model = Member) {
        super(model);
    }

    public async store(data: StoreMemberAttributes, certificate?: Nullable<MultipartFileContract>) {
        delete data.upload

        if (certificate) {
            const certificateFilename = `${data.companyName}.${certificate.extname}`;
            const certificatePath: string = Drive.disks.uploads.root
            const certificateFullPath: string = path.resolve(Drive.disks.uploads.root, certificateFilename)
            const destinationPath = `members/certificates/${certificateFilename}`
            await certificate.move(certificatePath, { name: certificateFilename })

            const bucket: Bucket = <Bucket>Application.container.use("firebase.storage")

            await bucket.upload(certificateFullPath, {
                destination: destinationPath,
            });


            data.certificate = `https://firebasestorage.googleapis.com/v0/b/${Config.get("firebase.projectId")}.appspot.com/o/${encodeURIComponent(destinationPath)}?alt=media`
        }

        try {
            const result = await this.model.store(data)
            if (result.id) {
                await this.createUser(result.id, result)

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

    public async createUser(memberId: string, member: Member) {

        try {
            const userService = new UserService()
            const user = (await userService.store({
                lastname : member.lastname,
                firstname: member.firstname,
                email    : member.email,
                phone    : member.phone,
                roleType : RoleType.member
            }, false)).data
            const authUser = user

            await this.model.update(memberId, { uid: authUser.uid })

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

}
