"use strict";

/*
 * sphere-api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 11:59
 * File src/ArticleParagraph/ArticleParagraphController
 */

import Controller              from "QRCP/Sphere/Common/Controller";
import ArticleParagraphService from "QRCP/Sphere/_Article/ArticleParagraph/ArticleParagraphService";


export default class ArticleParagraphController extends Controller {

    protected service: ArticleParagraphService

    constructor() {
        super(new ArticleParagraphService())
    }
}
