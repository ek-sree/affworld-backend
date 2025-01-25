import bcrypt from 'bcryptjs'

export const hashedPassword = async(password: string): Promise<string>=>{
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password,saltRounds);
    return hashedPassword;
}

export const comparePassword= async(password:string, hashedPassword:string): Promise<boolean>=>{
    const isMatch = await bcrypt.compare(password, hashedPassword);
    return isMatch
}