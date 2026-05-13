import { Page } from "playwright";
import { AuthPageObject } from "./AuthPageObject";
import { DashboardPageObject } from "./DashboardPageObject";
import { AdminPageObject } from "./AdminPageObject";
// 1. Import the LoginController
import { LoginController } from "../api/controller/LoginController";
import { EmployeeController } from "../api/controller/EmployeeController";
import { time } from "node:console";

/**
 * Page Object Manager (POM) Class.
 * Acts as a centralized container for all Page Objects to simplify 
 * object creation and management within test scripts.
 */
export class PageObjectManager {
    // Define class properties for the Playwright Page and managed Page Objects
    readonly page: Page
    readonly authPageObject: AuthPageObject
    readonly dashboardPageObject: DashboardPageObject
    readonly loginController: LoginController
    readonly employeeController: EmployeeController
    readonly adminPageObject: AdminPageObject

    /**
     * Constructor initializes the shared Page instance and instantiates 
     * the available Page Objects.
     * @param page - The unique Playwright Page instance provided by the test fixture.
     */
    constructor(page: Page) {
        this.page = page
        
        // Initialize AuthPageObject by passing the shared page instance to its constructor
        this.authPageObject = new AuthPageObject(this.page)
        this.dashboardPageObject= new DashboardPageObject(this.page)
        this.adminPageObject= new AdminPageObject(this.page)

        this.loginController=new LoginController(this.page.request)
        this.employeeController= new EmployeeController(this.page.request)
        
    }

    /**
     * Getter method to provide access to the AuthPageObject instance.
     * Use this in test files to interact with login/authentication features.
     * @returns The initialized instance of AuthPageObject.
     */
    getAuthPageObject() {
        return this.authPageObject
    }
    getDashboardPageObject(){
        return this.dashboardPageObject
    }
    getAdminPageObject(){
        return this.adminPageObject
    }
    getLoginController(){
        return this.loginController
    }
    getEmployeeController(){
        return this.employeeController
    }
}