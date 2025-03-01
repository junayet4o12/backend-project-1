import config from "../config"
import { user_role } from "../modules/user/user.constant"
import { IUser } from "../modules/user/user.interface"
import { User } from "../modules/user/user.model"

const superUser = {
    id: '0001',
    email: 'muhammadjunayetmaruf@gmail.com',
    password: config.super_admin_default_password,
    needsPasswordChange: false,
    role: user_role.superAdmin,
    status: 'in-progress',
    isDeleted: false,
}

const seedSuperAdmin = async () => {
    const isSuperAdminExist = await User.findOne({ role: user_role.superAdmin });
    if (!isSuperAdminExist) {
        await User.create(superUser)
    }
}

export default seedSuperAdmin