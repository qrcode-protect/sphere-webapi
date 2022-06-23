"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:16
 * File app/Common/string
 */

export const lower = (value: string): string => value?.toLowerCase();

export const name = (value: string, replaceValue = "") => lower(value)?.replace(/[^A-Za-zàáâãäçèéêëìíîïñòóôõöùúûüýÿÀÁÂÃÄÇÈÉÊËÌÍÎÏÑÒÓÔÕÖÙÚÛÜÝ-]/g, replaceValue)

export const normalize = (value: Nullable<string>) => value?.normalize("NFD").replace(/[\u0300-\u036f]/g, "")

export const reverse = (value: Nullable<string>) => value?.split("")?.reverse().join("")

export const capitalize = (value) => value?.charAt(0).toUpperCase() + value?.slice(1).toLowerCase();

export const generateNumber = (lastname: string, phone: Nullable<string>, prefix?: string) => `${prefix ? prefix + "-": ""}00${lastname.toUpperCase().split("").reverse().join("").substring(0, 3)}${(phone ?? "XXXXXXXXXX").split("").reverse().join("").substring(0, 3)}`

export const urlSingleBackslashes = (url: string) => url.replace(RegExp(/\/\//g), "/").replace("http:/", "http://").replace("https:/", "https://")
