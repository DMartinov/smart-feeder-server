import * as argon2 from 'argon2';
import * as jwt from 'jsonwebtoken'
import { createUser, getUserIdentity } from './userService';

class AuthService {
    public async SignUp(email, password, name): Promise<any> {
        const passwordHash = await argon2.hash(password);

        return createUser({ passwordHash, email, name });
    }

    public async LogIn(email, password): Promise<any> {
        const user = await getUserIdentity(email);
        const correctPassword = await argon2.verify(user.password, password);
        if (!correctPassword) {
            throw new Error('Incorrect password')
        }


        return {
            user: {
                email: user.email,
                // name: user.name,
                id: user.id,
            },
            token: this.generateJwt(user)
        };
    }

    private generateJwt(user) {
        const data =  {
            _id: user._id, // TODO
            name: user.name,
            email: user.email
          };
          const signature = process.env.JWT_SIGNATURE;
          const expiration = '6h';
      
          return jwt.sign({ data, }, signature, { expiresIn: expiration }); 
    }
}
