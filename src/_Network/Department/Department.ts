"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 09/05/2022 at 10:54
 * File src/_Network/Department/Department
 */

import Model                from "QRCP/Sphere/Common/Model";
import DepartmentAttributes from "QRCP/Sphere/_Network/Department/DepartmentAttributes";

export default class Department extends Model {
    id: string
    code: string
    name: string

    constructor(attributes?: DepartmentAttributes) {
        super({ collectionName: "departments", model: Department });
        if (attributes) {
            super.createWithAttributes(attributes);
        }
    }
}
