"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 16/05/2022 at 12:17
 * File app/Common/index
 */


import { lower, name, normalize } from "App/Common/string";
import PhoneCleaner               from "App/Common/phone-cleaner";

type PersonalInfo = {
    lastname,
    firstname,
    username,
    phone,
    email,
}

export const personalKeys: string[] = [
    "lastname",
    "firstname",
    "username",
    "phone",
    "email",
]

export const cleanPersonalInformations = (data: PersonalInfo, allFields = true) => {
    const names: string[] = [
        "lastname",
        "firstname",
    ]

    const lowers: string[] = [
        "email",
    ]

    names.forEach(item => data[item] = name(data[item]))
    lowers.forEach(item => data[item] = lower(data[item]))

    if (data.firstname && data.lastname)
        data.username = normalize(`${data.firstname[0]}${data.lastname}`)?.replace(RegExp(/-/g), "")

    if (data.phone)
        data.phone = (new PhoneCleaner(data.phone)).number || null

    Object.keys(data).forEach((key: string) => typeof data[key] === "undefined" ? data[key] = null : null)

    if (allFields) {
        return data
    }

    Object.keys(data).forEach((key: string) => data[key] === null ? delete data[key] : null)

    return data
}

export const makeid = (length) => {
    let result = "";
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    const charactersLength = characters.length;
    for (let i = 0; i < length; i++) {
        result += characters.charAt(Math.floor(Math.random() *
            charactersLength));
    }
    return result;
}

export const toBool = (value: unknown) => typeof value !== "undefined" && (value === "true" || value === true)
