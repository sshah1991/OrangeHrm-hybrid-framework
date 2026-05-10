import { Locator, Page } from "playwright";

/**
 * Page Object Class representing the Authentication/Login page.
 * Follows the Page Object Model (POM) to decouple test logic from UI locators.
 */
export class AuthPageObject {

    // Define class properties for the Playwright Page instance and UI elements
    readonly page: Page
    readonly userName: Locator
    readonly password: Locator
    readonly loginButton: Locator

    /**
     * Constructor initializes the page instance and defines locators using Playwright's Locator API.
     * @param page - The Playwright Page object passed from the test or manager.
     */
    constructor(page: Page) {
        this.page = page
        
        // Locates the username input field by its ARIA role and accessible name
        this.userName = page.getByRole('textbox', { name: 'username' })
        
        // Locates the password input field by its ARIA role and accessible name
        this.password = page.getByRole('textbox', { name: 'password' })
        
        // Locates the login button by role, narrowed down by the specific text content
        this.loginButton = page.getByRole('button').filter({ hasText: 'Login' })
    }

    /**
     * Navigates the browser to the application's login entry point.
     * Uses the baseURL defined in the playwright.config.ts.
     */
    async navigateToLoginPage() {
        await this.page.goto("/")
    }

    /**
     * Orchestrates the login workflow by interacting with the identified UI elements.
     * @param userName - The username string to be entered.
     * @param password - The password string to be entered.
     */
    async doValidlogin(userName: string, password: string) {
        // Enters the username into the designated textbox
        await this.userName.fill(userName)
        
        // Enters the password into the designated textbox
        await this.password.fill(password)
        
        // Finalizes the login process by clicking the Login button
        await this.loginButton.click()
    }
}