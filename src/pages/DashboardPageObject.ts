import { Locator, Page } from "playwright";

export class DashboardPageObject {
    readonly page: Page
    readonly userDetailsDropdown: Locator
    readonly logout: Locator
    readonly adminTab: Locator

    constructor(page: Page) {
        this.page = page
        this.userDetailsDropdown = page.locator(".oxd-userdropdown-icon")
        this.logout = page.getByRole('menuitem',{name: 'Logout'})
        this.adminTab = page.getByRole('link', { name: 'Admin' });
    }

    async clickLogout() {
        await this.userDetailsDropdown.click()
        await this.logout.waitFor({state:'visible', timeout: 5000})
        await this.logout.click()
    }

    async clickAdmin(){
        await this.adminTab.click()

    }
}