import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';

chai.use(chaiHttp);
describe('#sample test', () => {
  it('should return hello world', () => {
    const test = 'hello world';
    expect(test).to.equal('hello world');
  });
});
