import test from "playwright/test";
import { AuthPageObject } from "../../src/pages/AuthPageObject";
import { PageObjectManager } from "../../src/pages/PageObjectManager";
import { LoginController } from "../../src/api/controller/LoginController";
import { expect } from "playwright/test";
import { LoginRequestModel } from "../../src/api/model/LoginRequestModel";
import { ENDPOINTS } from "../../src/constants/Endpoints";
import { EmployeeController } from "../../src/api/controller/EmployeeController";
import { CreateEmployeeRequestModel } from "../../src/api/model/CreateEmployeeRequestModel";
import { AdminPageObject } from "../../src/pages/AdminPageObject";
import { DashboardPageObject } from "../../src/pages/DashboardPageObject";
import { UserDetails, UserDetailsModel } from "../../src/pages/model/UserDetailsModel";
import { faker } from '@faker-js/faker';

/**
 * Test Suite: Admin Module Functional Tests
 * Description: Validates administrative tasks such as user management.
 */
test.describe('This test suite contains test for admin module', () => {
    console.log("[Info] Inside Admin Test Module")

    // Define the page objects for UI interaction
    let authPageObject: AuthPageObject
    let pageObjectManager: PageObjectManager
    let adminPageObject: AdminPageObject
    let dashboardPageObject: DashboardPageObject


    // Define the controllers for API interaction
    let loginContoller: LoginController
    let employeeController: EmployeeController

    // beforeAll hook: Runs once before any tests in this describe block start
    test.beforeAll("Executing beforeAll()", async ({ }) => {
        console.log("[Info] Inside BeforeAll()")
    })

    // beforeEach hook: Runs before every individual test case to ensure a clean state
    test.beforeEach("Executing beforeEach()", async ({ page }) => {
        console.log("[Info] Inside beforeEach()")

        // initialize the PageOjects using the PageObjectManager pattern
        pageObjectManager = new PageObjectManager(page)
        authPageObject = pageObjectManager.getAuthPageObject()
        dashboardPageObject = pageObjectManager.getDashboardPageObject()
        adminPageObject = pageObjectManager.getAdminPageObject()


        // initialize the controllers for API-based data setup
        loginContoller = pageObjectManager.getLoginController()
        employeeController = pageObjectManager.getEmployeeController()


        // Step: Navigate to the login page and verify the URL includes the expected path
        console.log("[Log] Navigating to login page...");
        await authPageObject.navigateToLoginPage()
        await expect(page).toHaveURL(/.*auth\/login/)

        // Step: Perform API-based login to bypass UI authentication for prerequisite steps
        console.log("[Log] Fetching login CSRF token...");
        const tokenFetched = await loginContoller.getLoginToken()
        await expect(tokenFetched).toBeDefined()
        await expect(tokenFetched.length).toBeGreaterThan(0)

        const payload: LoginRequestModel = {
            _token: tokenFetched,
            username: process.env.Valid_AdminUserName!,
            password: process.env.Valid_AdminPassword!
        }
        
        console.log("[Log] Performing API login...");
        await loginContoller.performAPILogin(payload)
    })

    /**
     * Test Case ID: ADM-01
     * Title: Smoke Successfully Add New Admin User
     * Strategy: Create employee via API, then create corresponding user via UI.
     */
    test('ADM-01 Smoke Successfully Add New Admin User', async ({ page }) => {
        console.log("************* [Info] Executing TestID: ADM-01 *************");

        // 1. Data Preparation & API Setup: Create a unique employee record
        console.log("[Step 1] Preparing test data and creating employee via API...");
        const randomID = Math.random().toString(36).substring(2, 7)
        const payload: CreateEmployeeRequestModel = {
            firstName: `Sumeet_${randomID}`,
            middleName: `Sumeet_${randomID}`,
            lastName: `Shah_${randomID}`,
            employeeId: (Math.floor(Math.random() * 90000) + 10000).toString(),
            empPicture: null
        };

        const firstName = await employeeController.createEmployee(payload);
        console.log(`[Info] API: Successfully created employee with First Name: ${firstName}`);

        // 2. Navigation: Access the Admin Management section from the Dashboard
        console.log("[Step 2] Navigating to Dashboard and clicking Admin module...");
        await page.goto('/web/index.php/dashboard/index');
        await dashboardPageObject.clickAdmin();
        await expect(page).toHaveURL(/.*admin\/viewSystemUsers/);
        console.log("[Info] UI: Landed on User Management page.");

        // 3. Form Initialization: Open the "Add User" interface
        console.log("[Step 3] Clicking 'Add' button to open User Creation form...");
        await adminPageObject.clickAdd();
        await expect(page).toHaveURL(/.*admin\/saveSystemUser/);

        // 4. User Data Model Generation: Define credentials for the new Admin user
        const newUser: UserDetailsModel = {
            role: 'Admin',
            employeeName: firstName,
            status: 'Enabled',
            username: "Sumeet_" + faker.internet.username(), // Note: Changed to .userName() to fix earlier error
            password: faker.internet.password() + "Aa1!"
        };
        console.log(`[Step 4] Generated User Payload: Role=${newUser.role}, Username=${newUser.username}`);

        // 5. Execution: Perform the UI actions to fill and save the form
        console.log("[Step 5] Filling the User Creation form and saving...");
        await adminPageObject.createUser(newUser);

        // 6. Verification: Confirm success via toast message presence and URL redirection
        console.log("[Step 6] Verifying successful redirection back to System Users table...");
        await expect(adminPageObject.successToast).toBeEnabled
        await expect(page).toHaveURL(/.*admin\/viewSystemUsers/);
        console.log(`************* [SUCCESS] Created ${newUser.role} user: ${newUser.username} *************`);
    });
})