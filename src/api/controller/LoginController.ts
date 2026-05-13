import { BaseController } from "./BaseController";
import { ENDPOINTS } from "../../constants/Endpoints";
import { LoginRequestModel } from "../model/LoginRequestModel";

export class LoginController extends BaseController {
    async getLoginToken() {
        /**
        * Navigates to the login page via API and scrapes the CSRF token from the HTML.
        */
        // 1. Hit the login page
        const response = await this.request.get(ENDPOINTS.LOGIN_PAGE)
        const html = await response.text()
        // New Regex targeting the Vue property :token
        // It looks for :token=" followed by &quot; then captures everything until the next &quot;
        const tokenMatch = html.match(/:token="&quot;([^&]+)&quot;"/);
        if (!tokenMatch) {
            throw new Error("Failed to extract CSRF token from OrangeHRM login page. The UI structure might have changed.");
        }
        const token = tokenMatch[1];
        console.log(`[API Info] Successfully extracted CSRF Token: ${token}`);
        return token;
    }

    async performAPILogin(loginPayload: LoginRequestModel) {
        const response = await this.request.post(ENDPOINTS.LOGIN_VALIDATE,
            {
                form: { ...loginPayload },
                maxRedirects: 2
            }
        )

    }
}