import { APIRequestContext } from "playwright";

export class BaseController{
    protected request: APIRequestContext

    constructor(request:APIRequestContext){
        this.request=request
    }
}