/**
 * Interface for internal test data tracking of an Employee.
 */
export interface EmployeeDetailsModel {
    firstName: string;
    lastName: string;
    employeeId: string;
    middleName?: string; // Optional field
}