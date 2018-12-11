import { expect } from 'chai';
import faker from 'faker';
import helpers from '../../server/helpers/validationHelper';

const  { isSocialMediaEmail } = helpers;

describe('If an email is a social media email or not', () => {
    it('Should fail if a non social media email is supplied', () => {
        const bool = isSocialMediaEmail(faker.internet.email());
        expect(bool).to.be.equals(false);
    });
    it('Should pass when facebook email is provided', () => {
        const bool =
        isSocialMediaEmail(`${faker.name.firstName()}@facebook.com`);
        expect(bool).to.be.equals(true);
    });
    it('Should pass when twitter email is provided', () => {
        const bool =
        isSocialMediaEmail(`${faker.name.firstName()}@twitter.com`);
        expect(bool).to.be.equals(true);
    });
});
