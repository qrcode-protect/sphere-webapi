"use strict";

/*
 * api
 *
 * (c) Sofiane Akbly <sofiane.akbly@qrcode-protect.com>
 *
 * Created by WebStorm on 12/05/2022 at 10:54
 * File src/Request/Request
 */

import Service                                     from "QRCP/Sphere/Common/Service";
import Request                                     from "QRCP/Sphere/Request/Request";
import { Error as SofiakbError, Result, Success, } from "@sofiakb/adonis-response";
import { MultipartFileContract }                   from "@ioc:Adonis/Core/BodyParser";
import RequestAttributes                           from "QRCP/Sphere/Request/RequestAttributes";
import QuoteService                                from "QRCP/Sphere/Quote/QuoteService";
import { filter, indexOf, map }                    from "lodash";
import RequestMail                                 from "QRCP/Sphere/Request/RequestMail";

// interface StoreRequestAttributes extends RequestAttributes {
//     upload?: unknown
// }

export default class RequestService extends Service {

    constructor(model = Request) {
        super(model);
    }

    async all(partnerId?: string) {
        // (await this.model.byUserId(partnerId))
        return partnerId ? Result.success(await (await this.model.byUserId(partnerId)).orderBy("createdAt", "desc").get()) : Result.unauthorized();
    }

    async accepted(partnerId?: string, options ?: { paginate: boolean, page: number, limit: number }) {
        (await this.model.byUserId(partnerId)).whereSnapshot("status", "ACCEPTED")/*.orderBy("createdAt", "desc")*/.get()
        return options?.paginate ? this.paginate() : Result.success(await this.model.orderBy("createdAt", "desc").get());
        // return Result.success(await (await this.model.byUserId(partnerId)).whereSnapshot("status", "ACCEPTED").orderBy("createdAt", "desc").get());
    }

    async declined(partnerId?: string, options ?: { paginate: boolean, page: number, limit: number }) {
        (await this.model.byUserId(partnerId)).whereSnapshot("status", "DECLINED")/*.orderBy("createdAt", "desc")*/.get()
        return options?.paginate ? this.paginate() : Result.success(await this.model.orderBy("createdAt", "desc").get());
        // return Result.success(await (await this.model.byUserId(partnerId)).whereSnapshot("status", "DECLINED").orderBy("createdAt", "desc").get());
    }

    async pending(partnerId?: string, options ?: { paginate: boolean, page: number, limit: number }) {
        (await this.model.byUserId(partnerId)).whereSnapshot("status", "PENDING")/*.orderBy("createdAt", "desc")*/.get()
        return options?.paginate ? this.paginate() : Result.success(await this.model.orderBy("createdAt", "desc").get());
        // return Result.success(await (await this.model.byUserId(partnerId)).whereSnapshot("status", "PENDING").orderBy("createdAt", "desc").get());
    }

    private async quoteResponse(results: { requestsService: SofiakbError | Success, quotationService: SofiakbError | Success }, options ?: { paginate: boolean, page: number, limit: number }) {
        if (results.requestsService instanceof SofiakbError)
            return results.requestsService;

        // const quotationServiceResult = await (new QuoteService()).acceptedByCurrentTransmitter(partnerId ?? undefined)
        if (results.quotationService instanceof SofiakbError)
            return results.quotationService;

        const quotationIdentifiers = map(results.quotationService.message, item => item.id)

        console.log(quotationIdentifiers)

        const result = filter(results.requestsService.message, item => {
            const _index = indexOf(quotationIdentifiers, item.quotationId)
            console.log(item.quotationId, results.requestsService.message)

            if (_index >= 0) {
                quotationIdentifiers.splice(_index, 1)
                return item;
            }
        })

        return options?.paginate ? this.paginateData(result, options.page, options.limit) : result
    }

    async terminated(partnerId?: string, options ?: { paginate: boolean, page: number, limit: number }) {
        return this.quoteResponse({
            requestsService : await this.accepted(partnerId),
            quotationService: await (new QuoteService()).acceptedByCurrentTransmitter(partnerId)
        }, options)
        /*const requestsServiceResult = await this.accepted(partnerId)
        if (requestsServiceResult instanceof SofiakbError)
            return requestsServiceResult;

        const quotationServiceResult = await (new QuoteService()).acceptedByCurrentTransmitter(partnerId)
        if (quotationServiceResult instanceof SofiakbError)
            return quotationServiceResult;

        const quotationIdentifiers = map(quotationServiceResult.message, item => item.id)

        /!*return Result.success(filter(requestsServiceResult.message, item => {
            const _index = indexOf(quotationIdentifiers, item.quotationId)

            if (_index >= 0) {
                quotationIdentifiers.splice(_index, 1)
                return item;
            }
        }));*!/

        return this.paginateData(filter(requestsServiceResult.message, item => {
            const _index = indexOf(quotationIdentifiers, item.quotationId)

            if (_index >= 0) {
                quotationIdentifiers.splice(_index, 1)
                return item;
            }
        }))*/
    }

    async deniedByMember(partnerId?: string, options ?: { paginate: boolean, page: number, limit: number }) {
        return this.quoteResponse({
            requestsService : await this.accepted(partnerId),
            quotationService: await (new QuoteService()).declinedByCurrentTransmitter(partnerId)
        }, options)
        /*const requestsServiceResult = await this.accepted(partnerId)
        if (requestsServiceResult instanceof SofiakbError)
            return requestsServiceResult;

        const quotationServiceResult = await (new QuoteService()).declinedByCurrentTransmitter(partnerId)
        if (quotationServiceResult instanceof SofiakbError)
            return quotationServiceResult;

        const quotationIdentifiers = map(quotationServiceResult.message, item => item.id)

        return Result.success(filter(requestsServiceResult.message, item => {
            const _index = indexOf(quotationIdentifiers, item.quotationId)

            if (_index >= 0) {
                quotationIdentifiers.splice(_index, 1)
                return item;
            }
        }));*/
    }

    public async accept(docID: string, data: RequestAttributes, quote?: Nullable<MultipartFileContract>, partnerId?: string) {

        const quoteServiceResult = await (new QuoteService()).store({
            amount   : data.amount,
            expiresAt: data.expiresAt,
            customer : data.memberId
        }, quote, partnerId)
        if (!(quoteServiceResult instanceof SofiakbError)) {
            const quotation = quoteServiceResult.data

            console.log("send mail to partner, member and admin")

            const request = await this.model.accept(docID, quotation.id)

            RequestMail.sendQuotation(request, quotation, quote)
                .then(() => RequestMail.quotationSent(request, quote))

            return Result.success(request)
        }

        return quoteServiceResult
        // return this.model.accept(docID, { quotation: data.quote })
    }

    public async decline(docID: string) {
        const request = await this.model.decline(docID)
        RequestMail.declined(request)
        return Result.success(request)
    }

    async paginate(page = 1, limit = 1): Promise<any> {
        return super.paginate(page, limit, "createdAt", "desc");
    }

}
