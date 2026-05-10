// Import Playwright test runner and assertion library
import test, { expect } from "playwright/test";
// Import Page Objects for modular interaction with the application
import { AuthPageObject } from "../../src/pages/AuthPageObject";
import { PageObjectManager } from "../../src/pages/PageObjectManager";

// Describe block to group related test cases for the Login module
test.describe('This test suite contains test for login module', () => {
    // Log initialized when the test suite starts
    console.log("[Info] Inside Login Test Module")
    
    // Declare shared variables for Page Objects and the Manager
    let authPageObject: AuthPageObject
    let pageObjectManager: PageObjectManager

    // beforeAll hook: Runs once before any tests in this describe block start
    test.beforeAll("Executing beforeAll()", async ({ }) => {
        console.log("[Info] Inside BeforeAll()")
    })

    // beforeEach hook: Runs before every individual test case to ensure a clean state
    test.beforeEach("Executing beforeEach()", async ({ page }) => {
        console.log("[Info] Inside beforeEach()")
        
        // Initialize the PageObjectManager with the current test's page instance
        pageObjectManager = new PageObjectManager(page)
        
        // Retrieve the specific AuthPageObject from the manager
        authPageObject = pageObjectManager.getAuthPageObject()
        
        // Navigate to the login page and verify the URL includes the expected path
        await authPageObject.navigateToLoginPage()
        await expect(page).toHaveURL(/.*auth\/login/)
    })

    /**
     * Test Case: LOG-01
     * Objective: Verify that a user can login successfully with valid credentials.
     */
    test('LOG-01 Smoke Successful Login with Valid Credentials', async ({ page }) => {
        console.log("************* [Info] Executing TestID: LOG-01 *************")

        // Perform login action using credentials retrieved from environment variables
        const response = await authPageObject.dologin(
            process.env.Valid_AdminUserName!,
            process.env.Valid_AdminPassword!
        );
        
        // Assertion: Verify that successful login redirects the user to the Dashboard
        await expect(page).toHaveURL(/.*dashboard/);
    })

    test('LOG-03 Smoke Login with Invalid Password',async({page})=>{
        console.log("************* [Info] Executing TestID: LOG-03 *************")
        const response= await authPageObject.dologin(
            process.env.InValid_AdminUserName!,
            process.env.InValid_AdminPassword!
        )
       await expect(authPageObject.loginErrorMessage).toBeVisible()
    })
})