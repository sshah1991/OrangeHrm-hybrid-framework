import { ENDPOINTS } from "../../constants/Endpoints";
import { CreateEmployeeRequestModel } from "../model/CreateEmployeeRequestModel";
import { BaseController } from "./BaseController";

export class EmployeeController extends BaseController{
    async createEmployee(payload_emp:CreateEmployeeRequestModel){
        const response= await this.request.post(ENDPOINTS.EMPLOYEE_PAGE,
            {
                data:payload_emp
            }
        )
        const responseBody=await response.json()
        return responseBody.data.firstName
    }

}