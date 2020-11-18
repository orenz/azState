
class azWatcher  {
    constructor() {
        
        this.__proxiex={};
        this.__timeout={};
        this.watchCBs={};
    }
    
    startWatch(watchObj,delay=true){
        let root = Symbol("root");
        this.__proxiex[root]={};
        //return this.watchFactory(watchObj,cb,'root',root,delay);
        return this.watchFactory(watchObj,(p)=>{this.topLevelCb(p)},'root',root,delay);
        
    }
    
    watchFactory(watchObj,cb,path,root,delay){
        
        let validator={
            set: (obj, prop, value)=> {        
                obj[prop] = value;
                //cb(`${path}.${prop}`);
                this.delaydb(()=>{cb(`${path}.${prop}`)},delay,root)
                return true;
            },
            get:(obj, prop, receiver)=> {                            
                let value = obj[prop];                
                if (typeof value === 'object') {                 
                    if (!this.__proxiex[root][`${path}.${prop}`]){ //so we do not duplicate proxies for each get
                        //console.log("zzz new proxy",`${path}.${prop}`)
                        this.__proxiex[root][`${path}.${prop}`] = this.watchFactory(value,cb,`${path}.${prop}`,root,delay);
                    }
                    return this.__proxiex[root][`${path}.${prop}`];                        
                }
            },
            deleteProperty: (obj, prop)=> {                                 
                delete obj[prop];
                //cb(`${path}.${prop}`);
                this.delaydb(()=>{cb(`${path}.${prop}`)},delay,root)
                return true;            
            }
        }

        return new Proxy(watchObj, validator);
    }
    
    delaydb(cb,delay,root){        
        if (!delay){cb();return;}

        if (this.__timeout[root]){
            clearTimeout(this.__timeout[root]);            
        }

        this.__timeout[root] = setTimeout(()=>{
            delete this.__timeout[root];
            cb();
        },50)
    }
    
    topLevelCb(path){
        let pathArr = path.split('.');
        let curPath='';
        for (let rec of pathArr){
            curPath+=rec;
            if (this.watchCBs[curPath]){
                for (let cb of this.watchCBs[curPath]){
                    cb(path)
                }
            }
            curPath+=".";
        }
    }
    
    addWatch(path,cb){
        path='root'+(path? `.${path}` : ''); 
        if (this.watchCBs[path]){
            this.watchCBs[path].push(cb);
        }else{
            this.watchCBs[path]=[cb];
        }
    }
}


export { azWatcher }