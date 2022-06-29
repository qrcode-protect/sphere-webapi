"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 29/06/2022 at 14:20
 * File app/Common/file
 */


import moment                           from "moment";
import Drive                            from "Config/drive";
import path                             from "path";
import { Bucket, GetSignedUrlResponse } from "@google-cloud/storage";
import Application                      from "@ioc:Adonis/Core/Application";
import Config                           from "@ioc:Adonis/Core/Config";
import { MultipartFileContract }        from "@ioc:Adonis/Core/BodyParser";

export const upload = async (file: MultipartFileContract, fileDestinationPath: string): Promise<string> => {
    const filename = `${moment().unix()}.${file.extname}`;
    const filePath: string = Drive.disks.uploads.root
    const fileFullPath: string = path.resolve(Drive.disks.uploads.root, filename)
    const destinationPath = `${fileDestinationPath}/${filename}`

    let fileUrl: Nullable<string> = null

    await file.move(filePath, { name: filename })

    const bucket: Bucket = <Bucket>Application.container.use("firebase.storage")

    await bucket.upload(fileFullPath, {
        destination: destinationPath,
    });

    await bucket.file(destinationPath)
        .getSignedUrl({ action: "read", expires: "01-01-2491" })
        .then((signedUrl: GetSignedUrlResponse) => fileUrl = signedUrl[0])
        .catch(() => fileUrl = `https://firebasestorage.googleapis.com/v0/b/${Config.get("firebase.projectId")}.appspot.com/o/${encodeURIComponent(destinationPath)}?alt=media`)

    return fileUrl!
}
