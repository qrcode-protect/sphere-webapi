"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 19/05/2022 at 09:44
 * File config/jwt
 */

import Env from "@ioc:Adonis/Core/Env";

type JwtConfig = {
    secret: string,
    ttl: number,
}

/*
|--------------------------------------------------------------------------
| Jwt Config
|--------------------------------------------------------------------------
|
*/
const jwtConfig: JwtConfig = {
    secret: Env.get("JWT_SECRET"),
    ttl: Env.get("JWT_TTL", 60),
}

export default jwtConfig
