"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/LogReader/LogReader
 */

import Service      from "QRCP/Sphere/Common/Service";
import Application  from "@ioc:Adonis/Core/Application";
import { Dirent }   from "fs";
import { FileType } from "QRCP/Sphere/LogReader/file-type";
import { Result }   from "@sofiakb/adonis-response";

const { promises: { readdir, readFile, rmdir, } } = require("fs")

const fs = require("fs")
const logPath = `${Application.appRoot}/storage/logs`

const listFiles = async (filePath: string, directoriesOnly = false) => {
    if (!fs.existsSync(filePath))
        return []

    if (fs.lstatSync(filePath).isFile()) {
        return (await readFile(filePath, { encoding: "utf8" }))
    }

    const files = (await readdir(filePath, { withFileTypes: true }))

    return (directoriesOnly ? files.filter(dirent => dirent.isDirectory()) : files).map((file: Dirent) => ({
        name    : file.name,
        fileType: file.isDirectory() ? FileType.directory : FileType.file,
        isFile  : file.isFile(),
        fullPath: `${filePath}/${file.name}`.replace(logPath, ""),
        time    : fs.statSync(`${filePath}/${file.name}`).mtime.getTime()
    })).sort(function (a, b) {
        return b.time - a.time;
    })
    /*.filter(dirent => dirent.isDirectory())
    .map(dirent => dirent.name)*/
}

const cleanup = async (filePath: string) => {
    return filePath && filePath.trim() !== "" && fs.existsSync(filePath) ? (await rmdir(filePath, { recursive: true, force: true })) : true
}

// const listDirectories = async source => await listFiles(source, true)

export default class LogReaderService extends Service {

    logPath = logPath

    constructor() {
        super();
    }

    async list(path?: string) {
        return await listFiles(`${this.logPath}${path ? "/" + path : ""}`)
    }

    async clean() {
        return Result.success(await cleanup(this.logPath))
    }

}
