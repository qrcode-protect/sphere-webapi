"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:06
 * File src/Authentication/Jwt
 */

import { decode, DecodeOptions, JwtPayload, sign, SignOptions, verify, VerifyOptions } from "jsonwebtoken";

export default class Jwt {
    jwtSecret: string;
    options: any;

    constructor(jwtSecret: string) {
        this.jwtSecret = jwtSecret;
    }

    encode(payload: string | Buffer | object, options?: SignOptions): string {
        return sign(payload, this.jwtSecret, options);
    }

    decode(token: string | null, options?: DecodeOptions & { json: true }): string | JwtPayload | null {
        return token !== null ? decode(token, options) : null;
    }

    verify(token: string | null, options?: VerifyOptions): boolean {
        if (token === null)
            return false
        let valid = false;
        verify(token, this.jwtSecret, options, (err) => {
            valid = err === null;
        });
        return valid;
    }
}
