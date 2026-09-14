import { Controller, Get } from "@nestjs/common";
import { UserService } from "./user.service.js";



@Controller("Users")
export class UserController {
    constructor(private readonly userService: UserService) { }


    @Get("all-users")
    async getUsers() {
        return this.userService.allUsers()
    }
}




