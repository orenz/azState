# azState

## No more complex state managment.

```
    import * as w from "./azState.js";

    let wacher = new w.azWatcher();
    
    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}

    state=wacher.startWatch(state,false);    
     
    wacher.addWatch('',(path)=>{console.log("watch all",path)})
    
    state.people,push({name:"MR C"});
    state.subState.title="new title"
    

```

## Different listeners to different members of an object

```
     import * as w from "./azState.js";

    let wacher = new w.azWatcher();
    
    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}

    state=wacher.startWatch(state,false);    
     
    wacher.addWatch('',(path)=>{console.log("watch all",path)})
    wacher.addWatch('people',(path)=>{console.log("watch people",path)})
    wacher.addWatch('subState.title',(path)=>{console.log("watch subState.title",path)})
      
   state.aa={xx:1,yy:2}
   state.people.push({name:"MR C"})
   state.people[0].name="kuku"
   state.subState.y=5555;
   state.subState.titke="new title";
    
   

```
