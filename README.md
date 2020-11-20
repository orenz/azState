# azState

## No more complex state managment.

    Just a simple callback for each chage:
    
    ```
    state=wacher.startWatch(state);    
    wacher.addWatch(()=>{console.log("my state has changed")})
    ```
    
    The callback will be called for each change on the state object.

    A full example:
```
    import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    let wacher = new w.azWatcher();
    state=wacher.startWatch(state);    
    wacher.addWatch(()=>{console.log("my state has changed")})
    
    state.people.push({name:"MR C"});
    state.subState.title="new title"
    

```

## Different listeners to different members of an object

```
    import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    let wacher = new w.azWatcher();
    state=wacher.startWatch(state);    
     
    wacher.addWatch(()=>{console.log("my state has changed")})
    wacher.addWatch('people',()=>{console.log("the people array has changed")})
    wacher.addWatch('subState.title',()=>{console.log("state.subState.title hass changed")})
   
   state.aa={xx:1,yy:2}
   state.people.push({name:"MR C"})
   state.people[0].name="kuku"
   state.subState.y=5555;
   state.subState.titke="new title";
    
   

```

## Atomic changes

```
    import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    let wacher = new w.azWatcher();
    let wacher2 = new w.azWatcher();    

    let state1=wacher.startWatch(state);    
    let state2=wacher2.startWatch(state,false); //Acomic watch !!!     
    
    let i;
    wacher.addWatch(()=>{console.log("my state has changed")})
    wacher2.addWatch(()=>{console.log(`call number ${i} of a 100 calls`)}) //Atomic wather !!!
    
    for(i=0;i<100;i++){
        state1.people[0].count=i; //the watcher callbach will be called once at the end of the loop (default)
        state2.people[0].count=i;  //the watcher callbach will be called 100 time , once for each change. 
    }

```

## Get info of what attibutes chaned on your state

```

 import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    let wacher = new w.azWatcher();
    state=wacher.startWatch(state);    
     
    wacher.addWatch((changes)=>{
        console.log("my state has changed")
        if (changes.people[0].name) {
            console.log("first person name hass changes")
        
        }
      })
    
    state.people.push({name:"MR C"});
    state.subState.title="new title"
    state.people.name="new name"

```
