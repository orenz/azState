
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
        //return this.watchFactory(watchObj,cb,'root',root,delay);
        return this.watchFactory(watchObj,'root',root,delay);
        
    }
    
    watchFactory(watchObj,path,root,delay){
        
        let validator={
            set: (obj, prop, value)=> {        
                obj[prop] = value;
                //this.delaydb(()=>{cb(`${path}.${prop}`)},delay,root)
                this.topLevelCb(`${path}.${prop}`,delay,root);
                return true;
            },
            get:(obj, prop, receiver)=> {                            
                let value = obj[prop];                
                if (typeof value === 'object') {                 
                    if (!this.__proxiex[root][`${path}.${prop}`]){ //so we do not duplicate proxies for each get
                        //console.log("zzz new proxy",`${path}.${prop}`)
                        this.__proxiex[root][`${path}.${prop}`] = this.watchFactory(value,`${path}.${prop}`,root,delay);
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
                this.watchCBs[curPath].dirtyPath[path.slice(curPath.length+1)]=true;

                for (let cb of this.watchCBs[curPath].func){
                    if (!delay){
                        cb(path)
                    }else{
                        let closureF = ((curPath,cb)=>{
                            let pathObj =this.makeObjectFromPathsArr(this.watchCBs[curPath].dirtyPath);
                            return ()=>{cb(pathObj);this.watchCBs[curPath].dirtyPath={}}
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
        path='root'+(path? `.${path}` : ''); 
        this.watchCBs[path]=this.watchCBs[path] || {};
        if (this.watchCBs[path].func ){
            this.watchCBs[path].func.push(cb);
        }else{
            this.watchCBs[path].func=[cb];
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


export { azWatcher }