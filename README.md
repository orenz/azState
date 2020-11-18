# azState

No more complex state managment.

```
    import * as w from "./azState.js";

    let wacher = new w.azWatcher();
    
    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}

    state=wacher.startWatch(state,false);    
     
    wacher.addWatch('',(path)=>{console.log("watch all",path)})
    
    state.people,push({name:"MR C"});
    state.subState.title="new title"
    

```
