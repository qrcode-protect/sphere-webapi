"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/_Network/Department/DepartmentController
 */

import Controller        from "QRCP/Sphere/Common/Controller";
import DepartmentService from "QRCP/Sphere/_Network/Department/DepartmentService";


export default class DepartmentController extends Controller {

    protected service: DepartmentService

    constructor() {
        super(new DepartmentService())
    }
}
