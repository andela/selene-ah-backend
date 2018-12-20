import { expect } from 'chai';
import helpers from '../../server/helpers/validationHelper';

const  { isFieldValid } = helpers;

describe('An Input field validity based on the supplied arguments', () => {
    it('Should return fail if an empty string is provided', () => {
        const bool = isFieldValid('');
        expect(bool).to.be.equals(false);
    });
    it('Should fail if there is a lot of white spaces', () => {
        const bool = isFieldValid('      naso    ', 15);
        expect(bool).to.be.equals(false);
    });
    it(`Should pass if string length is more than the length
     passed as the second argument`, () => {
        const bool = isFieldValid('this is who i am',10);
        expect(bool).to.be.equals(true);
    });
});
