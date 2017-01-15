import { TreeService,Node } from './../lib/service/tree-service';
const assert = require('chai').assert;
import * as p from 'path';

function setup(){
    return {
        service: new TreeService(),
        demoFolderPath: p.join(__dirname,'demo-folder')
    }
}

describe("TreeService",function(){
    it("hello",function(){
        console.log("hello");
    });

    it('readSubNode',function(done){
        const {service,demoFolderPath} = setup();
        console.log(demoFolderPath);

       service.readSubNode(new Node(demoFolderPath,null),node => {
           console.log(node);
       }).then(node => {
           console.log(node);
           done();
       });
    });
});