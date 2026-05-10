// Import Playwright test runner and assertion library
import test, { expect } from "playwright/test";
// Import Page Objects for modular interaction with the application
import { AuthPageObject } from "../../src/pages/AuthPageObject";
import { PageObjectManager } from "../../src/pages/PageObjectManager";
import { DashboardPageObject } from "../../src/pages/DashboardPageObject";
import { LoginController } from "../../src/api/controller/LoginController";
import { LoginRequestModel } from "../../src/api/model/LoginRequestModel";
import { ENDPOINTS } from "../../src/constants/Endpoints";

// Describe block to group related test cases for the Login module
test.describe('This test suite contains test for login module', () => {
    // Log initialized when the test suite starts
    console.log("[Info] Inside Login Test Module")
    
    // Declare shared variables for Page Objects and the Manager
    let authPageObject: AuthPageObject
    let pageObjectManager: PageObjectManager
    let dashboardPageObject: DashboardPageObject

    //Declare the Controllers
    let loginController: LoginController

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
        dashboardPageObject= pageObjectManager.getDashboardPageObject()

        //retrive the controllers
        loginController=pageObjectManager.getLoginController()
        
        
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

    test.only('LOG-02 Sanity Logout Functionality',async({page})=>{
        console.log("************* [Info] Executing TestID: LOG-02 *************")
        const tokenFetched= await loginController.getLoginToken()
        expect(tokenFetched).toBeDefined()
        expect(tokenFetched.length).toBeGreaterThan(0)

        const loginPayload:LoginRequestModel={
            _token:tokenFetched,
            username:process.env.Valid_AdminUserName!,
            password: process.env.Valid_AdminPassword!
        }
        await loginController.performAPILogin(loginPayload)
        await page.goto(ENDPOINTS.DASHBOARD_PAGE, { waitUntil: 'networkidle' });
        await expect(page).toHaveURL(/.*dashboard/);
        await dashboardPageObject.clickLogout()
        await expect(page).toHaveURL(/.*login/)

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