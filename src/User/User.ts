"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:23
 * File src/User/User
 */

import Model                 from "QRCP/Sphere/Common/Model";
import ModelChildConstructor from "QRCP/Sphere/Common/interfaces/model-child-constructor";

export default class User extends Model {

    constructor(options?: ModelChildConstructor) {
        super({ collectionName: "list_restaurant", model: User });
        if (options?.attributes) {
            super.createWithAttributes(options?.attributes);
        }
    }

    /*public store() {
        return null;
    }*/

}
