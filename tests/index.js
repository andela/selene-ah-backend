import chaiHttp from "chai-http";
import chai, { expect } from "chai";
import server from "../index";

chai.use(chaiHttp);
describe("#sample test", function() {
  it("should return hello world", function() {
    const test = "hello world";
    expect(test).to.equal("hello world");
  });
});
