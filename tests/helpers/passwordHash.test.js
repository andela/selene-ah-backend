import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import passwordHash from '../../server/helpers/auth/passwordHash';

describe('#PasswordHash', () => {
  afterEach(()=> sinon.restore());
  const hashPasswordSpy = sinon.spy(bcrypt, 'hashSync');
  const hashedPassword = passwordHash.hashPassword('opeyemi');
  context('#hashPassword', () => {
    it('Should return hashed string if password is provided', () => {
      expect(hashedPassword).to.not.be.equal('opeyemi');
      expect(typeof hashedPassword).to.be.equal('string');
      expect(hashPasswordSpy.called).to.equal(true);
    });

    it('should throw error if password is null or empty', () => {
      expect(() => passwordHash.hashPassword(null))
        .to.throw('No password defined');
    });
    after(() => {
      hashPasswordSpy.restore();
    });
  });

  context('#comparePassword', () => {
    it('Should return true if password is equal to hashed password', () => {
      const comparePasswordSpy = sinon.spy(bcrypt, 'compareSync');
      const hashed = passwordHash.comparePassword('opeyemi', hashedPassword);
      expect(hashed)
        .to.be.equal(true);
      expect(comparePasswordSpy.called).to.be.equal(true);
      comparePasswordSpy.restore();
    });

    it('should throw error if password is null or empty', () => {
      expect(() => passwordHash.comparePassword(null, hashedPassword))
        .to.throw('No password or hashedPassword defined');
    });

    it('should throw error if hashedPassword is null or empty', () => {
      expect(() => passwordHash.comparePassword('opeyemi', null))
        .to.throw('No password or hashedPassword defined');
    });
  });
});
