# azState

## No more complex state managment.

```
    import * as w from "./azState.js";

    let wacher = new w.azWatcher();
    
    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}

    state=wacher.startWatch(state);    
     
    wacher.addWatch(()=>{console.log("my state has changed")})
    
    state.people.push({name:"MR C"});
    state.subState.title="new title"
    

```

## Different listeners to different members of an object

```
    import * as w from "./azState.js";

    let wacher = new w.azWatcher();
    
    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}

    state=wacher.startWatch(state);    
     
    wacher.addWatch(()=>{console.log("my state has changed")})
    wacher.addWatch('people',()=>{console.log("the people array has changed")})
    wacher.addWatch('subState.title',()=>{console.log("state.subState.title hass changed")})
   
   console.log(state.people);
   state.aa={xx:1,yy:2}
   state.people.push({name:"MR C"})
   state.people[0].name="kuku"
   state.subState.y=5555;
   state.subState.titke="new title";
    
   

```
