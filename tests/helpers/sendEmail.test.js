import { expect } from 'chai';
import faker from 'faker';
import sendEmail from '../../server/helpers/sendEmail';

describe('Sends an email', () => {
   const template = {
        from : faker.internet.email(),
        subject: faker.lorem.text(),
        markup: faker.lorem.sentences(),
        text: faker.lorem.text(),
    };
    it('should send an email to a valid address', async () => {
        const res = await sendEmail(faker.internet.email(), template);
        expect(res).to.be.an('array');
        });
});
