import { Injectable } from "@nestjs/common";



@Injectable()
export class UserService {
    constructor() { }

    allUsers(): Object[] {
        let users = [
            {
                id: "01",
                name: "ahmed"
            },
            {
                id: "02",
                name: "Menna"
            },
        ]
        return users
    }
}