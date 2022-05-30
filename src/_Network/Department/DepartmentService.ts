"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/_Network/Department/Department
 */

import Service              from "QRCP/Sphere/Common/Service";
import DepartmentAttributes from "QRCP/Sphere/_Network/Department/DepartmentAttributes";
import Department           from "QRCP/Sphere/_Network/Department/Department";

export default class DepartmentService extends Service {

    constructor(model = Department) {
        super(model);
    }

    public store = async (data: DepartmentAttributes) => super.store(data)

}
