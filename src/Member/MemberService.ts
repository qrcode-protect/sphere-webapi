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
            if (result.id)
                return Result.success(result)
            throw new Error("Error while saving")
        } catch (e) {
            Log.error(e, true)
            if (e instanceof DuplicateEntryException) {
                return Result.duplicate()
            }
            return Result.error("Une erreur est survenue, merci de réessayer plus tard.")
        }

    }

    /*private async createCertificatesBucket(bucketName = "sphere-dev") {
        // Creates the new bucket
        await Application.container.use("firebase.storage").createBucket(bucketName);
        console.log(`Bucket ${bucketName} created.`);
    }*/

}
