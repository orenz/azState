!(()=>{    
	let serviceRegistered = false;
	if ('serviceWorker' in navigator) {
	//  window.addEventListener('load', function() {
	    navigator.serviceWorker.register('/azStareService.js').then(function(registration) {
	      // Registration was successful
	      console.log('ServiceWorker registration successful with scope: ', registration.scope);
	      serviceRegistered=true;
	    }, function(err) {
	      // registration failed :(
	      console.log('ServiceWorker registration failed: ', err);
	    });
//	  });
    }
})
    


class azWatcher  {
    constructor() {
        
        this.__proxiex={};
        this.__timeout={};
        this.watchCBs={};
    }
    
    startWatch(watchObj,delay=true){
        let root = Symbol("root");
        this.__proxiex[root]={};
        this.__timeout[root]={};
        
        let state =this.watchFactory(watchObj,'root',root,delay);
    
        return state;           
    }
    
    watchFactory(watchObj,path,root,delay){
        
        let validator={
            set: (obj, prop, value)=> {        
                obj[prop] = value;                
                if ([Symbol.for('azState'),Symbol.for('azStatepPath')].includes(prop) ){return true}
                
                this.topLevelCb(`${path}.${prop}`,delay,root);

                return true;
            },
            get:(obj, prop, receiver)=> {                            
                let value = obj[prop];                
                if (typeof value === 'object' && Symbol.for('azState') !=prop) {                 
                    if (!this.__proxiex[root][`${path}.${prop}`]){ //so we do not duplicate proxies for each get                        
                        this.__proxiex[root][`${path}.${prop}`] = this.watchFactory(value,`${path}.${prop}`,root,delay);
                        this.__proxiex[root][`${path}.${prop}`][Symbol.for('azState')]=obj[Symbol.for('azState')]; // add the watcher here     
                        this.__proxiex[root][`${path}.${prop}`][Symbol.for('azStatepPath')]=`${obj[Symbol.for('azStatepPath')]}.${prop}`
                        //add relavie path so w can remove it.                                            
                    }
                    return this.__proxiex[root][`${path}.${prop}`];                        
                }
                return value;
            },
            deleteProperty: (obj, prop)=> {                                 
                delete obj[prop];
                //this.delaydb(()=>{cb(`${path}.${prop}`)},delay,root)
                this.topLevelCb(`${path}.${prop}`,delay,root);
                return true;            
            }
        }

        return new Proxy(watchObj, validator);
    }
    
    delaydb(cb,delay,root,path){        
        if (!delay){cb();return;}

        if (this.__timeout[root][path]){
            clearTimeout(this.__timeout[root][path]);            
        }

        this.__timeout[root][path] = setTimeout(()=>{
            delete this.__timeout[root][path];
            cb();
        },50)
    }
    
    topLevelCb(path,delay,root){
           
        let pathArr = path.split('.');
        let curPath='';
        for (let rec of pathArr){
            curPath+=rec;
            if (this.watchCBs[curPath] && this.watchCBs[curPath].func){
                this.watchCBs[curPath].dirtyPath=this.watchCBs[curPath].dirtyPath || {};
                this.watchCBs[curPath].dirtyPath[path.slice(curPath.length+1)]=true; //light up the relative path

                for (let cb of this.watchCBs[curPath].func){

                    cb.dirtyPath=cb.dirtyPath || {};
                    cb.dirtyPath[path.slice(curPath.length+1)]=true; //light up the relative changed path

                    if (!delay){
                        let pathObj =this.makeObjectFromPathsArr(cb.dirtyPath);
                        cb.f(pathObj);
                        cb.dirtyPath={};
                    }else{
                        let closureF = ((curPath,cb)=>{
                            
                          
                            let pathObj =this.makeObjectFromPathsArr(cb.dirtyPath);
                            return ()=>{cb.f(pathObj);cb.dirtyPath={}}
                        })(curPath,cb)
                        
                        this.delaydb(closureF,delay,root,curPath)
                    }
                    
                }
            }
            curPath+=".";
        }
    }
    
    addWatch(path,cb){
        
        
        if (typeof(path) == 'function'){
            cb=path;
            path='';
        }
        path=path.replace(/^\./, ''); //remove first dot, 
        
        path='root'+(path? `.${path}` : ''); 
        this.watchCBs[path]=this.watchCBs[path] || {};
        if (this.watchCBs[path].func ){
            this.watchCBs[path].func.push({f:cb});
        }else{
            this.watchCBs[path].func=[{f:cb}];
        }
    }

    makeObjectFromPathsArr(pathsArr){        
        let ob={};               
        for (let p in pathsArr){
            
            let pArr=p.split(".");
            let curOb=ob;
            for (let prop of pArr){
                if (!curOb[prop]){
                    curOb[prop]={};
                }
                curOb=curOb[prop];
            }
        }
        return ob;
    }
}

function createState(state,delay){
    let wacher = new azWatcher();
    state=wacher.startWatch(state,delay);    
    state[Symbol.for('azState')]=wacher;
    state[Symbol.for('azStatepPath')]='';
    return state;   
}

function addWatch(state,path,cbPrm){
    if (typeof(path) == 'function'){
        cbPrm=path;
        path='';
    }
    
    let cb = (path)=>{cbPrm(path,state)}
    let wacher = state[Symbol.for('azState')];    
    
    let relativePath= state[Symbol.for('azStatepPath')].replace(/^\./, ''); //remove first dot, ;
    path ? wacher.addWatch(`${state[Symbol.for('azStatepPath')]}.${path}`,cb,relativePath) : 
    relativePath ? wacher.addWatch(relativePath,cb) : wacher.addWatch(cb,relativePath);    
}

export { azWatcher ,createState,addWatch}