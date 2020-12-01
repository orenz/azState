# azState vanilla powerful and simple state management



## No more complex state managment.
   
```
    import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    
    state= state=w.createState(state,true); 
    w.addWatch(state,()=>{console.log("my state has changed")})
    
    state.people.push({name:"MR C"});
    state.subState.title="new title"
    

```

## Different listeners to different members of an object

```
    import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    state=w.createState(state,true);         
     
    w.addWatch(state,()=>{console.log("my state has changed")}) //watch the whole state object
    w.addWatch(state,'people',()=>{console.log("the people array has changed")}) //only watch changes in the people array
    w.addWatch(state,'subState.title',()=>{console.log("state.subState.title hass changed")}) //only watch changes in the subAtate title attribute
   
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
    
   

    let state1=w.createState(state,true); 
    let state2=w.createState(state,false); //Acomic watch !!!     
    
    let i;
    w.addWatch(state1,()=>{console.log("my state has changed")})
    w.addWatch(state2,()=>{console.log(`call number ${i} of a 100 calls`)}) //Atomic wather !!!
    
    for(i=0;i<100;i++){
        state1.people[0].count=i; //the watcher callbach will be called once at the end of the loop (default)
        state2.people[0].count=i;  //the watcher callbach will be called 100 time , once for each change. 
    }

```

## Get info of what attibutes chaned on your state

```

 import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:"MR B"}],subState:{title:"this is substate"}}
    
    state=w.createState(state,true);    
     
    w.addWatch(state,(changes)=>{
        console.log("my state has changed")
        if (changes.people[0].name) {
            console.log("first person name hass changes")
        
        }
      })
    
    state.people.push({name:"MR C"});
    state.subState.title="new title"
    state.people.name="new name"

```

## Hey, you can add wathces to sublasses of a state

```
   import * as w from "./azState.js";

   let state ={people:[{name:"MR A"},{name:{f:"MR B",l:"the scond"} }],subState:{title:"this is substate"}}
   
   state=w.createState(state,true);    
   w.addWatch(state,()=>{console.log("I am watching thos")}) //watch the whole state object
   someFunc(state.people[1]);
   
   function someFunc(person){
      w.addWatch(ppl,()=>{console.log("I watch this person")}) //watch the whole state object
   }
```
   
## On any callback you will get the attributes that ware changed, and a snapshot of the state object
   
```
     import * as w from "./azState.js";

    let state ={people:[{name:"MR A"},{name:{f:"MR B",l:"the scond"} }],subState:{title:"this is substate"}}

    state=w.createState(state,true);    
    
    //snap is a snapshot of the state
    w.addWatch(state,(path,snap)=>{console.log("watch all",path,snap)})
    
```


