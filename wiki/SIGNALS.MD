# Signals

### Samples:

#### to create:

```typescript
import Signal from "./Signal";

new Signal();
```
#### to use:

```typescript
import Signal from "./Signal";

const signal = new Signal();

signal.add(()=>{
    console.log("Hey World!")
});
signal.add(()=>{
    console.log("Do some things when this will be happened!")
});

signal.emit();
```
### Sample: 
```typescript
//in some server controller:
spinBtn.onClickSignal.add(()=>{
    server.makeSpinRequest()
});
//in some ui controller: 
spinBtn.onClickSignal.add(()=>{
    reels.startSpinning();
});
```
