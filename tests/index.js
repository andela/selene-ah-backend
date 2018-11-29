import chaiHttp from 'chai-http';
import chai, { expect } from 'chai';
import server from '../index';

chai.use(chaiHttp);
describe('#sample test', () => {
  it('should return hello world', () => {
    const test = 'hello world';
    expect(test).to.equal('hello world');
  });
});
