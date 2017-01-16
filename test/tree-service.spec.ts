import { TreeService,Node } from './../lib/service/tree-service';
import * as chai from 'chai';
const expect = chai.expect;
import * as p from 'path';

function setup(){

    const demoFolderPath = p.join(__dirname,'res','demo-folder')
    return {
        service: new TreeService(),
        demoFolderPath: demoFolderPath,
        demoFolderTopNodes: [p.join(demoFolderPath,'folder1'),p.join(demoFolderPath,'file1.md')]
    }
}

describe("TreeService",function(){

    it('readSubNode',function(done){
        const {service,demoFolderPath,demoFolderTopNodes} = setup();

       service.readSubNode(new Node(demoFolderPath,null),node => {
        //    console.log('single call back = ' + node);
           expect(node.path).to.be.oneOf(demoFolderTopNodes)
       },node => {
        //    console.log('finish = ' + node);
           expect(node.path).to.be.equal(demoFolderPath);
           expect(node.children.length).to.be.equal(demoFolderTopNodes.length);
           done();
       });
    });
});