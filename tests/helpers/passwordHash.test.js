import { expect } from 'chai';
import sinon from 'sinon';
import bcrypt from 'bcryptjs';
import passwordHash from '../../server/helpers/passwordHash';

describe('#PasswordHash', () => {
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
    const comparePasswordSpy = sinon.spy(bcrypt, 'compareSync');
    it('Should return true if password is equal to hashed password', () => {
      expect(passwordHash.comparePassword('opeyemi', hashedPassword))
        .to.be.equal(true);
      expect(comparePasswordSpy.called).to.be.equal(true);
    });

    it('should throw error if password is null or empty', () => {
      expect(() => passwordHash.comparePassword(null, hashedPassword))
        .to.throw('No password or hashedPassword defined');
    });

    it('should throw error if hashedPassword is null or empty', () => {
      expect(() => passwordHash.comparePassword('opeyemi', null))
        .to.throw('No password or hashedPassword defined');
    });
    after(() => {
      comparePasswordSpy.restore();
    });
  });
});
