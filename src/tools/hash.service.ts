import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

@Injectable()
export class HashService {
  private algorithm = 'BCRYPT';
  private workFactor = 10;

  async hashPassword(plainTextPassword: string) {
    let salt = await bcrypt.genSalt(this.workFactor);
    const hash = await bcrypt.hash(plainTextPassword, salt);

    // * remove header from salt
    salt = salt.split('$').slice(-1)[0];
    return { hash, salt };
  }

  async verifyPassword(plainTextPassword: string, hashedPassword: string) {
    return await bcrypt.compare(plainTextPassword, hashedPassword);
  }
  getMetaData() {
    return {
      algorithm: this.algorithm,
      workFactor: this.workFactor,
    };
  }
}
