import { Locator, Page } from "playwright"
import { UserDetails } from "./model/UserDetailsModel";

export class AdminPageObject{
    
    readonly page:Page
    readonly addButton:Locator
    readonly userRole: Locator;
    readonly employeeName: Locator;
    readonly employeeNameDropdown: Locator;
    readonly employeeNameSearching: Locator;  // 👈 extracted
    readonly status: Locator;
    readonly username: Locator;
    readonly passwordInput: Locator;
    readonly confirmPasswordInput: Locator;
    readonly saveBtn: Locator;
    readonly adminPageHeader: Locator;
    readonly successToast: Locator;
    
    
    constructor(page:Page){
        this.page=page
        this.addButton=page.getByRole('button',{name:"Add"})
        this.userRole = page.locator('.oxd-input-group').filter({ hasText: 'User Role' }).locator('i');
        this.employeeName = page.getByPlaceholder('Type for hints...');
        this.employeeNameDropdown = page.locator('.oxd-autocomplete-dropdown');  // 👈 container
        this.employeeNameSearching = page.getByText('Searching...');             // 👈 extracted
        
        this.status = page.locator('.oxd-input-group').filter({ hasText: 'Status' }).locator('i');
        this.username = page.locator('.oxd-input-group').filter({ hasText: 'Username' }).locator('input');

        this.passwordInput = page.locator('.oxd-input-group').filter({ hasText: 'Password' }).locator('input').first();
        this.confirmPasswordInput = page.locator('.oxd-input-group').filter({ hasText: 'Confirm Password' }).locator('input');

        this.saveBtn = page.getByRole('button', { name: 'Save' });
        this.adminPageHeader = page.locator('.oxd-topbar-header-breadcrumb');
        this.successToast = page.getByText('Successfully Saved');
    }
    async clickAdd(){
        await this.addButton.click()
    }
    async createUser(userDetails: UserDetails){
        await this.userRole.click();
        await this.page.getByRole('option', { name: userDetails.role }).click();
        await this.employeeName.click();
        await this.employeeName.pressSequentially(userDetails.employeeName, { delay: 100 });
        await this.employeeNameDropdown.waitFor({ state: 'visible' });
        await this.employeeNameSearching.waitFor({ state: 'hidden' });
        await this.employeeNameDropdown.locator('.oxd-autocomplete-option').first().click();
        await this.status.click();
        await this.page.getByRole('option', { name: userDetails.status }).click();
        await this.username.fill(userDetails.username);
        await this.passwordInput.fill(userDetails.password);
        await this.confirmPasswordInput.fill(userDetails.password);
        await this.saveBtn.click();
    }
    
}